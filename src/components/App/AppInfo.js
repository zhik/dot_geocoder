import React from 'react';
import { Message, Popup, Icon  } from 'semantic-ui-react';
import example from '../../css/example.gif';

const AppInfo = ()=> {
    return(
        <div className="help">
            <Message info>
                <Message.Header>Instructions: </Message.Header>
                <ul>   
                    <li>Select a file (1), Select a function, then corresponding fields, lastly start geocoding (2)</li>
                    <li>Remove or Include certain fields in Export Columns (3)</li>
                    <li>Click on rows with errors to correct for errors using the editor tool</li>
                    <li>To preview the data click on "View on Map" located at the Download section</li>
                    <li>Don't geocode files larger than 1000 entries (for the Block function try to keep entries under 100), it will cause lag or crashes</li>
                    <li>If you get redirected to a blank page, when you download a shapefile, your export is too big. Try to reduce the fields or geocode in parts.</li>
                </ul>
                <h3>Video Guide:
                    <Popup
                        position='bottom center' 
                        trigger={<Icon name='question circle outline' />}
                        content={<img height="500px" src={example} alt="example of instructions"/>}
                    />
                </h3>
            </Message>
        </div>
    )
}

export default AppInfo;