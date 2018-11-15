import React from 'react';
import { Form, Input,Message, Label,Dropdown } from 'semantic-ui-react'


const FileUpload = ({_onFileChange, fileError, tabOptions, tabValue, _onTabChange}) => {
    return(
        <div className="section">
            <Label as='a' color='olive' ribbon='left'>1</Label>
            <Form.Field required>
                <Input input='file' onChange={_onFileChange}/>
            </Form.Field>
            {
                tabOptions && tabOptions.length > 1 ? (
                    <Dropdown placeholder='Tabs' onChange={_onTabChange} selection value={tabValue} options={tabOptions} />
                ) : null
            }

            {
                fileError ? 
                <Message
                error
                header='File type not supported'
                content='Only use csv, tsv or excel files'
                /> : null
            }
        </div>
    )
}

export default FileUpload;
                