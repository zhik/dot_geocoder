const API_URLS = {
    'LocationServiceAPI': {
        'dev': 'http://dotvlvweb/LocationServiceAPI',
        'qa': 'http://dotvlvweb/LocationServiceAPI',
        'prod': 'http://dotvlvweb/LocationServiceAPI'
    }
}

function getAPIURL(name, build){
    return build in API_URLS[name] ? API_URLS[name][build] : API_URLS[name].prod;
}

module.exports = getAPIURL;