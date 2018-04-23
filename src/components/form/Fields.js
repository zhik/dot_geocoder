import React from 'react';
import options from './options';
import { Form, Select, Popup, Button } from 'semantic-ui-react'
import '../../css/Fields.css';

const Fields = ({ header,selectedType, fields, _changeField, _changeStep }) => {
    const optionsfields = options[selectedType].fields;
    
    return(
        <div>
            <Form>
                {optionsfields.map((field,i) => {
                    const headerOptions = ['empty', ...header].map((column,i)=> (
                        {
                            key: `${column}-${field.name}-${i}`, 
                            text: column,
                            value: column
                        }
                    ));

                    return(
                        <Form.Field required={field.required} key={`${field.name}-${i}`}>
                            <label>{field.name} 
                                {field.comments ? <Popup trigger={<i className="info circle icon"></i>} content={field.comments}/> : null}
                            </label>
                            <Select search options={headerOptions} value={fields[field.name]} onChange={(event, data) => _changeField(event,data,field.name)}/>
                        </Form.Field> 
                    )
                })}


                {/* <Form.Checkbox 
                    inline 
                    label='Auto-assign compass directions, if needed'
                    required
                /> */}
            </Form>

            {Object.values(fields).some(field => field !== null) ? <div className='marginButton'><Button onClick={() => _changeStep('confirm')}>Next</Button></div>
            : null}
        </div>
    )
}

export default Fields;