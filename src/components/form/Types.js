import React from 'react';
import options from './options';
import { Message, Select } from 'semantic-ui-react'

const Types = ({selectedType, _changeType}) => {
    const typesOptions = Object.keys(options).map(type => (
        {
            key: type, 
            text: options[type].name,
            value: type
        }
    ))
    return(
        <React.Fragment>
            <Select placeholder='Select Function' options={typesOptions} value={selectedType} onChange={_changeType}/>
            {selectedType ? 
                <Message >
                    {options[selectedType].description}
                </Message> 
            : null}
        </React.Fragment>
    )
}

export default Types;