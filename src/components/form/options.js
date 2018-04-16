const options = {
    exactAddress: {
        name: 'Exact Address',
        fields: [
            {
                name: 'HouseNumber',
                required : false,
                comments: 'House number of the exact address'
            },
            {
                name: 'Street',
                required : true,
                comments: 'Street Name'
            },
            {
                name: 'Borough',
                required : false,
                comments: "Valid Values provided in the Common Request Parameters section (Required if ZipCode not given) ['Manhattan','Bronx','Brooklyn','Queens','Staten Island']"
            },
            {
                name: 'ZipCode',
                required : false,
                comments: 'Standard USPS 5-digit zip code or zip+4. Must be a valid zip code for an area within New York City limits. (	Required if Borough not given)'
            },
        ],
        description: 'Given a valid address, provides Street Name information and block-face level information.'
    },
    intersection: {
        name: 'Intersection',
        fields: [
            {
                name: 'CrossStreetOne',
                required : false,
                comments: 'First Cross Street (Required if NodeId not given)'
            },
            {
                name: 'CrossStreetTwo',
                required : false,
                comments: 'Second Cross Street (Required if NodeId not given)'
            },
            {
                name: 'Borough',
                required : false,
                comments: "Borough of first cross street or of all cross streets if no other borough parameter is supplied. (Required if NodeId not given) ['Manhattan','Bronx','Brooklyn','Queens','Staten Island']"
            },
            {
                name: 'NodeId',
                required : false,
                comments: 'NodeId of a given intersection (Required if Borough, CrossStreetOne, and CrossStretTwo not given)'
            },
            {
                name: 'BoroughCrossStreetTwo',
                required : false,
                comments: 'Borough of second cross street. If not supplied, assumed to be same as borough parameter.'
            },
            {
                name: 'CompassDirection',
                required : false,
                comments: 'Required for streets that intersect more than once. Valid values are: N, S, E or W.'
            },
        ],
        description: 'Given a valid borough and cross streets returns information for the point defined by the two streets.'
    },
}

export default options;
