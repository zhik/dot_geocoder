import React from 'react';
import { Form, Input,Message, Label } from 'semantic-ui-react'

const FileUpload = ({_onFileChange, fileError}) => {
    return(
        <div className="section">
            <Label as='a' color='olive' ribbon='left'>1</Label>
            <Form.Field required>
                <Input input='file' onChange={_onFileChange}/>
            </Form.Field>

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
                