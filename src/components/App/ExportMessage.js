import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

const ExportMessage = ({message}) => {

    if(message.body){
        return (
            <div className='help'>
                <Message icon warning compact>
                <Icon name='exclamation triangle' />
                <Message.Content>
                {message.body}
                </Message.Content>
                </Message>
            </div>
        )
    }else{
        return null;
    }
}

export default ExportMessage;