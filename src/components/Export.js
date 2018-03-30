import React from 'react';
import { Button } from 'semantic-ui-react'

const Export = ({ exportColumns, _downloadExcel, _downloadShape }) => {
    //filter for only true exportColumns
    const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]);

    return (
        <div className="export">
        <Button
            color='grey'
            content='Download as Excel'
            icon='download'
            onClick={_downloadExcel}
        />
        <Button
            color='green'
            content='Download as Shapefile'
            icon='world'
            onClick={_downloadShape}
            disabled={!(exportColumnsTrue.indexOf("Longitude") > -1 && exportColumnsTrue.indexOf("Latitude") > -1)}
        />
        </div>
    )
}

export default Export;