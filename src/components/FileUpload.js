import React from 'react';
import { Form, Input,Message } from 'semantic-ui-react'

const FileUpload = ({_onFileChange, fileError}) => {
    return(
        <div >
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
                