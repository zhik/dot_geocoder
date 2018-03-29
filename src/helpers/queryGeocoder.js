const generateURL = (type, params) => {
    const requestParams = Object.keys(params).reduce((requestParams, param) => {
        return requestParams += `${param}=${params[param]}&`
    },'')

    return `http://dotvlvweb/LocationServiceAPI/api/${type}?${requestParams}`
}


const queryGeocoder = (type, params) => {
    return new Promise((resolve, reject) => {
        return fetch(generateURL(type,params))
                .then(res => res.json())
                .then(data => {
                    //check for errors
                    if (data.ErrorMessage) reject(data.ErrorMessage);
                    if (data.GeoSupportError) reject(data.GeoSupportError);

                    
                    resolve(data)
                })
                .catch(err => reject(err))
    });
}

export default queryGeocoder;