import { download } from 'shp-write';

const exportShapefile = (header, body, epsg) => {
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

    //create geojson
    const fc = {
        type: 'FeatureCollection',
        features: []
    }

    fc.features = body.map(row => {
        //bind header and body into object
        const properties = row.reduce( (properties, cell, index) => {
            properties[header[index]] = cell;
            return properties;
        },{})

        const feature =  {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(properties[x]) || undefined, parseFloat(properties[y]) || undefined]
            },
            properties
        }

        return feature;
    })


    //write to shp.zip
    console.log(fc)

    const shp_options = {
        folder: 'output',
            types: {
            point: 'points'
        },
        epsg: epsg
    }

    download(fc , shp_options);
}

export default exportShapefile;