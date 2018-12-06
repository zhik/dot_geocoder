import React from 'react';
import { Button, Popup,Label } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

const Export = ({ exportColumns, _downloadExcel, _downloadShape, children, type, history}) => {
    //filter for only true exportColumns
    const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]);

    const shapefile2263Button = (
        <Button
            color='facebook'
            content='Shapefile NAD83(2263)'
            icon='world'
            onClick={(event) => _downloadShape(event, 2263)}
            disabled={!type && (!(exportColumnsTrue.indexOf("XCoordinate") > -1 && exportColumnsTrue.indexOf("YCoordinate") > -1))}
        />
    )

    const shapefile4326Button = (
        <Button
            color='blue'
            content='Shapefile WGS84(4326)'
            icon='world'
            onClick={(event) => _downloadShape(event, 4326)}
            disabled={
                //disable button for non block call ('app' and 'map' views)
                (type ? type.includes('block') : false) 
                ? false 
                : (!(exportColumnsTrue.indexOf("Longitude") > -1 && exportColumnsTrue.indexOf("Latitude") > -1))
            }
        />
    )

    const mapButton = (type) => {
        switch(type){
            case 'block':
                return <Button icon="map" size='tiny' onClick={()=> history.push('/blockmap')} content={<NavLink to="/blockmap">View on Map</NavLink>}/>;
            case 'blockmap':
                return <Button icon="arrow left" size='tiny' onClick={()=> history.push('/block')} content={<NavLink to="/block">Go back</NavLink>}/>;
            case 'map':
                return <Button icon="arrow left" size='tiny' onClick={()=> history.push('/')} content={<NavLink to="/">Go back</NavLink>}/>;
            default:
                return <Button icon="map" size='tiny' onClick={()=> history.push('/map')} content={<NavLink to="/map">View on Map</NavLink>}/>;
        }
    }
    return (
        <div className="section">
            <Label as='a' color='olive' ribbon='left'>4</Label>
            <h3>Download</h3>
            <p>{`NAD83(2263) is used by the DOT,  WGS84(4326) is used by Web Maps(Google, Bing, etc) ${type !== 'block' ? '- to enable WSG84 include Latitude and Longitude in Export Columns': ''}`}</p>
            <Button
                color='grey'
                content='CSV/Excel'
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
            {mapButton(type)}
            {children}
        </div>
    )
}

export default Export;