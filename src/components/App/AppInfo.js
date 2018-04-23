import React from 'react';
import { Message, Popup, Icon  } from 'semantic-ui-react';
import example from '../../css/example.gif';

const AppInfo = ()=> {
    return(
        <div className="help">
            <Message info>
                <Message.Header>Instructions</Message.Header>
                <ol>
                    <li>Choose a file, then select a function.</li>
                    <li>Click on Next, then select the corresponding fields. Not all fields have to be filled out, check info icon for help</li>
                    <li>Click on Next, then "start geocoding"</li>
                    <li>Scroll down, select the columns you want to include in your export by checking boxes "Export Columns"</li>
                    <li>You can either download as Excel (spreadsheet) or shapefile (for Arcgis)</li>
                    <li>To Preview the data click on "Map" located in the navbar.</li>
                </ol>
                <Popup 
                    position='bottom center' 
                    trigger={<Icon name='question circle outline' />}
                    content={<img height="500px" src={example} alt="example of instructions"/>}
                />
            </Message>
        </div>
    )
}

export default AppInfo;