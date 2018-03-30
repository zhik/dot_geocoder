import React from 'react';
import options from './options';
import { Form, Select, Popup } from 'semantic-ui-react'

const Fields = ({ header,selectedType, fields, _changeField }) => {
    const optionsfields = options[selectedType].fields;

    return(
        <div>
            <Form>
                {optionsfields.map((field,i) => {
                    const headerOptions = ['null', ...header].map((column,i)=> (
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
        </div>
    )
}

export default Fields;