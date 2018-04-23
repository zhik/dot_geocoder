import React from 'react';
import options from './options';
import { Message, Select, Button } from 'semantic-ui-react'

const Types = ({selectedType, _changeType, _changeStep}) => {
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
            {selectedType ?
                <Button disabled={!selectedType} onClick={() => selectedType ? _changeStep('fields'): null}>Next</Button>
                :null}
        </React.Fragment>
    )
}

export default Types;