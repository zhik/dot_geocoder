import { download } from 'shp-write'

const exportShapefile = (header, body) => {
    if( !((header.indexOf("Longitude") > -1 && header.indexOf("Latitude") > -1 ))) return null

    //create geojson
    const fc = {
        type: 'FeatureCollection',
        features: [],
        options: {
            folder: 'output',
        }
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
                coordinates: [parseFloat(properties.Longitude) || 0, parseFloat(properties.Latitude) || 0]
            },
            properties
        }

        return feature
    })


    //write to shp.zip
    console.log(fc)
    download(fc)
}

export default exportShapefile;