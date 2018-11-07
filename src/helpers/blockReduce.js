/**
 * takes the results of a processed queryGeocoder all Promise query and formats it for block usage. 
 * 
 * @param {*} results  {...data, error: false, rowIndex: i, debug: {query, type, string: JSON.stringify(query)}}
 */
import queryGeocoder from './queryGeocoder';


export function blockReduce(results, type) {
    return new Promise(async (resolve, reject) => {

        //modify results depend on if it contains the list or error.
        const agg = []
        for (const result of results) {
            //check for BlockFaceList, append to list
            if (result.hasOwnProperty('BlockFaceList')) {
                await Promise.all(result.BlockFaceList.map(async (item, i) => {
                    if (item.AuxiliarySegmentIds) {
                        const segmentID = item.AuxiliarySegmentIds.join(',');
                        const geojson = await queryGeocoder('LionSegmentConflation', {
                            segmentID
                        }).then(data => {
                            //combine array of results into one geojson
                            return data.reduce((p, i) => {
                                p[4326].properties.segmentID.push(i.NewSegmentId);
                                p[2263].properties.segmentID.push(i.NewSegmentId);

                                p[4326].geometry.coordinates = p[4326].geometry.coordinates.concat(i.GeomWebMercator.coordinates);
                                p[2263].geometry.coordinates = p[2263].geometry.coordinates.concat(i.GeoJson.coordinates);
                                return p;
                            }, {
                                4326: {
                                    "type": "Feature",
                                    "properties": {
                                        "segmentID": []
                                    },
                                    "geometry": {
                                        "type": "MultiLineString",
                                        "coordinates": []
                                    }
                                },
                                2263: {
                                    "type": "Feature",
                                    "properties": {
                                        "segmentID": []
                                    },
                                    "geometry": {
                                        "type": "MultiLineString",
                                        "coordinates": []
                                    }
                                },
                            })
                        })
                        item.geojson = geojson;
                    } else {
                        //make dummy geojson for INPUT DOES NOT DEFINE A STREET SEGMENT
                        const geometryType = {
                            'extendedStretch_blockface': 'MultiLineString',
                            'extendedStretch_intersection': 'Point'
                        }

                        const geometryDummy = {
                            'extendedStretch_blockface': [[[0,0],[0,0]]],
                            'extendedStretch_intersection': [0,0]
                        }

                        item.geojson = {
                            4326: {
                                "type": "Feature",
                                "properties": {
                                    "dummy": true
                                },
                                "geometry": {
                                    "type": geometryType.hasOwnProperty(type) ? geometryType[type] : null,
                                    "coordinates" : geometryDummy.hasOwnProperty(type) ? geometryDummy[type] : null,
                                }
                            },
                            2263: {
                                "type": "Feature",
                                "geometry": {
                                    "type": geometryType.hasOwnProperty(type) ? geometryType[type] : null,
                                    "coordinates" : geometryDummy.hasOwnProperty(type) ? geometryDummy[type] : null,
                                }
                            }
                        };
                    }

                    //add some info to properties 
                    if(item.geojson[4326].properties && item.geojson[2263].properties){
                        const oft = `${item.OnStreetName}:${item.CrossStreetOneName}:${item.CrossStreetTwoName}`
                        item.geojson[4326].properties.oft = oft; 
                        item.geojson[2263].properties.oft = oft;
                    }
                    
                    item.rowIndex = result.rowIndex;
                    item.listIndex = i;
                    item.error = '';
                    agg.push(item);

                }))
            } else if (result.hasOwnProperty('IntersectionList')) {
                result.IntersectionList.forEach((item, i) => {
                    //format geojson of node

                    let {XCoordinate, YCoordinate, Longitude, Latitude, LionNodeNumber} = item;

                    item.geojson = {
                        4326: {
                            "type": "Feature",
                            "properties": {
                                LionNodeNumber
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [Longitude ? Longitude : undefined, Latitude ? Latitude : undefined]
                            }
                        },
                        2263: {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Point",
                                "coordinates": [XCoordinate ? XCoordinate : undefined, YCoordinate ? YCoordinate : undefined]
                            }
                        },
                    }

                    item.rowIndex = result.rowIndex;
                    item.listIndex = i;
                    item.error = '';
                    agg.push(item);
                });
            } else {
                agg.push(result);
            }
        }

        resolve(agg);

    })
}