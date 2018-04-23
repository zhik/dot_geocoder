import React from 'react';
import { Button, Popup } from 'semantic-ui-react'

const Export = ({ exportColumns, _downloadExcel, _downloadShape, children }) => {
    //filter for only true exportColumns
    const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]);

    const shapefile2263Button = (
        <Button
            color='green'
            content='Shapefile NAD83(2263)'
            icon='world'
            onClick={() => _downloadShape(2263)}
            disabled={!(exportColumnsTrue.indexOf("XCoordinate") > -1 && exportColumnsTrue.indexOf("YCoordinate") > -1)}
        />
    )

    const shapefile4326Button = (
        <Button
            color='blue'
            content='Shapefile WGS84(4326)'
            icon='world'
            onClick={() => _downloadShape(4326)}
            disabled={!(exportColumnsTrue.indexOf("Longitude") > -1 && exportColumnsTrue.indexOf("Latitude") > -1)}
        />
    )

    return (
        <div className="export">
        <h3>Download</h3>
            <p>NAD83(2263) is used by the DOT,  WGS84(4326) is used by Web Maps(Google, Bing, etc)</p>
        <Button
            color='grey'
            content='Excel'
            icon='download'
            onClick={_downloadExcel}
        />
        <Popup trigger={shapefile2263Button}>
            <Popup.Content>
                Exports to NAD83 / New York Long Island (ftUS) - Used by NYCDOT
            </Popup.Content>    
        </Popup>
        <Popup trigger={shapefile4326Button}>
            <Popup.Content>
                Exports to WGS 84 - Used by most web maps
            </Popup.Content>    
        </Popup>
        {children}
        </div>
    )
}

export default Export;