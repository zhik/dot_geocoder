import { download } from 'shp-write'; 

const exportShapefile = (fileName, header, body, epsg) => {
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
    const newHeader = header.map(cell => cell.replace(/[^a-z0-9_]+|^_+/gi,''));

    //create geojson
    const geojson = {
        type: 'FeatureCollection',
        features: []
    }

    geojson.features = body.map(row => {
        //bind header and body into object
        const properties = row.reduce( (properties, cell, index) => {
            properties[newHeader[index]] = cell;
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

    const shp_options = {
        folder: fileName,
            types: {
                point: fileName
            },
        epsg: epsg
    }

    download(geojson , shp_options);
}

export default exportShapefile;