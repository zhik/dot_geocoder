const generateURL = (type, params) => {
    //gernerate the url for LocationServiceAPI using type and parameters 
    const requestParams = Object.keys(params).reduce((requestParams, param) => {
        return requestParams += `${param}=${params[param]}&`
    },'')


    return `${process.env.LocationServiceAPI}/api/${type}?${requestParams}`
    //return `http://dotvlvweb/LocationServiceAPI/api/${type}?${requestParams}`;
}


const queryGeocoder = (type, params) => {
    //return a Promise that will catch if there are any geosupport errors, otherwise return the json
    return new Promise((resolve, reject) => {
        return fetch(generateURL(type,params))
                .then(res => res.json())
                .then(data => {
                    //check for errors
                    if (data.ErrorMessage) reject(data.ErrorDetails[0]);
                    if (data.GeoSupportError) reject(data.GeoSupportError);

                    
                    resolve(data)
                })
                .catch(err => reject(err));
    });
}

export default queryGeocoder;