const API_URLS = {
    'LocationServiceAPI': {
        'dev': 'http://dotdev55iis10.dotdev.com/LocationServiceAPI',
        'qa': 'http://dotqavlvweb01/LocationServiceAPI',
        'prod': 'http://dotvlvweb/LocationServiceAPI'
    }
}

function getAPIURL(name, build){
    return build in API_URLS[name] ? API_URLS[name][build] : API_URLS[name].prod;
}

module.exports = getAPIURL;