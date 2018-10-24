const FORMBLOCKOPTIONS = {
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

export default FORMBLOCKOPTIONS;
