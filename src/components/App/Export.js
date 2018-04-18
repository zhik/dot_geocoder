import React from 'react';
import { Button, Popup } from 'semantic-ui-react'

const Export = ({ exportColumns, _downloadExcel, _downloadShape, children }) => {
    //filter for only true exportColumns
    const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]);

    const shapefile2263Button = (
        <Button
            color='green'
            content='Download as Shapefile (2263)'
            icon='world'
            onClick={() => _downloadShape(2263)}
            disabled={!(exportColumnsTrue.indexOf("XCoordinate") > -1 && exportColumnsTrue.indexOf("YCoordinate") > -1)}
        />
    )

    const shapefile4326Button = (
        <Button
            color='blue'
            content='Download as Shapefile (4326)'
            icon='world'
            onClick={() => _downloadShape(4326)}
            disabled={!(exportColumnsTrue.indexOf("Longitude") > -1 && exportColumnsTrue.indexOf("Latitude") > -1)}
        />
    )

    return (
        <div className="export">
        <Button
            color='grey'
            content='Download as Excel'
            icon='download'
            onClick={_downloadExcel}
        />
        <Popup trigger={shapefile2263Button}>
            <Popup.Content>
                Exports to NAD83 / New York Long Island (ftUS) - Used by the NYCDOT
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