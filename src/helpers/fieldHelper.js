const BOROUGH_DICT = {
    'manhattan': 'Manhattan',
    '1': 'Manhattan',
    'm': 'Manhattan',
    'new york': 'Manhattan',
    'mn': 'Manhattan',

    'bronx': 'Bronx',
    'bx': 'Bronx',
    'x': 'Bronx',
    '2': 'Bronx',

    'brooklyn': 'Brooklyn',
    'bn': 'Brooklyn',
    'bk': 'Brooklyn',
    'k': 'Brooklyn',
    '3': 'Brooklyn',
    'kings': 'Brooklyn',

    'queens': 'Queens',
    'qn': 'Queens',
    'q': 'Queens',
    '4': 'Queens',
    
    'staten island': 'Staten Island',
    'si': 'Staten Island',
    'richmond': 'Staten Island',
    's': 'Staten Island',
    '5': 'Staten Island'
};


const fieldHelper = (cell, field) => {
    switch(field){
        case 'Borough':
            const cCell = String(cell.toLowerCase().trim());
            return cCell in BOROUGH_DICT ? BOROUGH_DICT[cCell] : cell;
        case 'CompassDirection':
            return String(cell.toUpperCase().trim())
        default:
            return String(cell).trim();
    }  
}

export default fieldHelper;