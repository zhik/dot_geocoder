import { download } from 'shp-write'; 

/**
 * directly exports from geojson FeatureCollection
 */
export const exportShapefileDirectly = (fileName, geojson, epsg) => {
    //write to shp.zip

    const shp_options = {
        folder: fileName,
            types: {
                point: fileName,
                line: fileName
            },
        epsg: epsg
    };


    download(geojson , shp_options);
}


/**
 * converts from header and body array format to geojson and exports 
 * 
 * @param {*} fileName 
 * @param {*} header 
 * @param {*} body 
 * @param {*} epsg 
 */
export const exportShapefile = (fileName, header, body, epsg) => {


    //if( !((header.indexOf("Longitude") > -1 && header.indexOf("Latitude") > -1 ))) return null

    let x, y;
    switch(epsg){
        case 2263:
            x = 'XCoordinate';
            y = 'YCoordinate';
            break;
        case 4326:
            x = "Longitude";
            y = "Latitude";
            break;
        default: 
            x = "Longitude";
            y = "Latitude";
    }

    //fix headers https://support.esri.com/en/technical-article/000005588
    //first remove _ underscores in the beginning
    //next replace illegal characters with _ underscores 
    const newHeader = header.map(cell => cell.replace(/[^a-z0-9_]+/gi,'_').replace(/^_+/gi,''));

    //create geojson
    const geojson = {
        type: 'FeatureCollection',
        features: []
    }

    // geojson.features = body.map(row => {
    //     //bind header and body into object
    //     const properties = row.reduce( (properties, cell, index) => {
    //         properties[newHeader[index]] = cell;
    //         return properties;
    //     },{})

    //     const feature =  {
    //         type: 'Feature',
    //         geometry: {
    //             type: 'Point',
    //             coordinates: [parseFloat(properties[x]) || undefined, parseFloat(properties[y]) || undefined]
    //         },
    //         properties
    //     }

    //     return feature;
    // })

    //only keep features that have value coordinates
    geojson.features = body.reduce( (features, row) => {
        const properties = row.reduce( (properties, cell, index) => {
            properties[newHeader[index]] = cell;
            return properties;
        },{});

        const feature =  {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(properties[x]) || undefined, parseFloat(properties[y]) || undefined]
            },
            properties
        }

        if(feature.geometry.coordinates[0] && feature.geometry.coordinates[1]){
            features.push(feature);
        }
        
        return features;
    }, [])


    //write to shp.zip

    const shp_options = {
        folder: fileName,
            types: {
                point: fileName
            },
        epsg: epsg
    }

    download(geojson , shp_options);
}
