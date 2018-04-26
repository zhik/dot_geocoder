import React from 'react';
import { Message, Popup, Icon  } from 'semantic-ui-react';
import example from '../../css/example.gif';

const AppInfo = ()=> {
    return(
        <div className="help">
            <Message info>
                <Message.Header>Tips: </Message.Header>
                {/* <ol>
                    <li>Choose a file</li>
                    <li>then select a function. (Exact Address, Intersection)</li>
                    <li>Click on Next, then select the corresponding fields.</li>
                    <li>Click on Next, then "start geocoding"</li>
                    <li>Scroll down, select the columns you want to include in your export by checking boxes "Export Columns"</li>
                    <li>You can either download as Excel (spreadsheet) or shapefile (for Arcgis)</li>
                </ol> */}
                <ul>   
                    <li>Select a file (1), Select a function, then corresponding fields, lastly start geocoding (2)</li>
                    <li>Remove or Include certain fields in Export Columns (3)</li>
                    <li>Click on rows with errors to correct for errors using the editor tool</li>
                    <li>To preview the data click on "Map" located in the navbar.</li>
                    <li>Don't geocode files larger than 1000 entries, it will cause lag or crashes</li>
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