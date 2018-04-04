import React from 'react';
import {  Message, Button, Icon, Label } from 'semantic-ui-react'

const Confirm = ({ _submitForm, status }) => {
    return(
        <div>
            <Button as='div' labelPosition='right' onClick={_submitForm} disabled={status.start}>
                <Button color='green'>
                    <Icon name='send' />
                    {status.start? 'geocoding...' : 'start geocoding'}
                </Button>
                <Label as='a' basic color='green' pointing='left'>{status.count}</Label>
                {
                    status.errorsCount ? 
                        <Label as='a' basic color='red' pointing='left'>{status.errorsCount}</Label> : null 
                }
            </Button>

            { status.start && !status.finshed ?
                <Message icon>
                    <Icon name='circle notched' loading/>
                    <Message.Content>
                        <Message.Header>Just a few seconds</Message.Header>
                            <Message.List>
                                <Message.Item>{`We are fetching. ${status.resultsCount} out of ${status.count}`}</Message.Item>
                                {status.errorsCount ? <Message.Item>{`There are ${status.errorsCount} errors`}</Message.Item> : null}
                            </Message.List>
                        </Message.Content>
                </Message> : null
            }

            { !status.start && status.finshed ?
                <Message icon>
                    <Icon name='checkmark'/>
                    <Message.Content>
                        <Message.Header>{`${status.errorsCount ? `${status.errorsCount} errors`: 'No errors'}`}</Message.Header>
                    </Message.Content>
                </Message> : null
            }
        </div>
    )
}

export default Confirm;