const FORMBLOCKOPTIONS = {
    extendedStretch_blockface: {
        name: 'Extended Stretch (blockface)',
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
                name: 'CompassDirectionOne',
                required : false,
                comments: 'Required for streets that intersect more than once. Valid values are: N, S, E or W.'
            },
            {
                name: 'CompassDirectionTwo',
                required : false,
                comments: 'Required for streets that intersect more than once. Valid values are: N, S, E or W.'
            }
        ],
        description: 'street segs for stretch'
    },
    extendedStretch_intersection: {
        name: 'Extended Stretch (intersection)',
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
                name: 'CompassDirectionOne',
                required : false,
                comments: 'Required for streets that intersect more than once. Valid values are: N, S, E or W.'
            },
            {
                name: 'CompassDirectionTwo',
                required : false,
                comments: 'Required for streets that intersect more than once. Valid values are: N, S, E or W.'
            }
        ],
        description: 'node ids for stretch'
    },
}

export default FORMBLOCKOPTIONS;
