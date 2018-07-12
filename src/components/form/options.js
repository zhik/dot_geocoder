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
                comments: '(w/o House number) + Street Name'
            },
            {
                name: 'Borough',
                required : true,
                comments: "Borough name, number, letter(s) [Required if ZipCode not given]"
            },
            {
                name: 'ZipCode',
                required : false,
                comments: 'Standard USPS 5-digit zip code or zip+4. (Required if Borough not given)'
            },
        ],
        description: 'Given a valid address, provides Street Name information and block-face level information.'
    },
    intersection: {
        name: 'Intersection',
        fields: [
            {
                name: 'CrossStreetOne',
                required : true,
                comments: 'First Cross Street (Required if NodeId not given)'
            },
            {
                name: 'CrossStreetTwo',
                required : true,
                comments: 'Second Cross Street (Required if NodeId not given)'
            },
            {
                name: 'Borough',
                required : true,
                comments: "Borough name, number, letter(s) of the first cross street or of all cross streets [Required if NodeId not given]"
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
    block: {
        name: 'Block',
        fields: [
            {
                name: 'OnStreet',
                required : true,
                comments: 'On street'
            },
            {
                name: 'CrossStreetOne',
                required : true,
                comments: '1'
            },
            {
                name: 'CrossStreetTwo',
                required : true,
                comments: '2'
            },
            {
                name: 'Borough',
                required : true,
                comments: "Borough name, number, letter(s) of the first cross street or of all cross streets [Required if NodeId not given]"
            },
            {
                name: 'BlockType',
                required : true,
                comments: "BlockType"
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
