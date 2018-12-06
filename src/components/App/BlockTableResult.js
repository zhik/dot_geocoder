import React, { Component } from 'react';
import { Table, Checkbox } from 'semantic-ui-react'
import flattenFields from '../../helpers/flattenFields';

import exportExcel from '../../helpers/exportExcel';
import {exportShapefileDirectly} from '../../helpers/exportShapefile';
import Export from './Export';

class BlockTableResult extends Component {

    state = {
        filterError: false
    }

    _downloadExcel = event => {
        event.preventDefault();
        const {header,body,results,exportColumns} = this.props;
        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]) 

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);
        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const resultsBody = results.map(row => {
            const newRow = [];
            //get bodyColumns using rowIndex
            bodyColumnsIndex.map(i => newRow.push(body[row.rowIndex][i]));

            const result = flattenFields(row);
            resultColumns.map(i => result[i] || result[i] === 0 ? newRow.push(result[i]) : newRow.push(''));
            
            return newRow;
        });
        exportExcel(this.props.fileName, [exportColumnsTrue, ...resultsBody]);
    }

    _downloadShape = (event, _epsg) => {
        event.preventDefault();
        const epsg = parseInt(_epsg, 10);
        const {header,body, exportColumns, results} = this.props;
        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]) 

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);
        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const geojson = results.reduce((geojson, feature) => {
            let newFeature = {
                "type": "Feature",
                "properties": {}
            };
            if(feature.geojson && feature.geojson[epsg]){
                newFeature.geometry = feature.geojson[epsg].geometry;
            }else{
                //dummy geometry 
                const type = {
                    'Blockface' : "MultiLineString",
                    'Intersection' : 'Point'
                }
                newFeature.geometry = {
                    "type": type[feature.debug.query.ExtendedStretchType],
                    "coordinates" : [
                        [[undefined,undefined],[undefined,undefined]]
                    ]
                }
            }


            //fix headers https://support.esri.com/en/technical-article/000005588
            //first remove _ underscores in the beginning
            //next replace illegal characters with _ underscores 


            //copy properties from body of org. excel
            bodyColumnsIndex.forEach((bodyIndex,i) => newFeature.properties[bodyColumns[i].replace(/[^a-z0-9_]+/gi,'_').replace(/^_+/gi,'')] = body[feature.rowIndex][bodyIndex]);

            //copy properties from results
            const properties_flatten = flattenFields(feature);


            resultColumns.forEach(column => newFeature.properties[column.replace(/[^a-z0-9_]+/gi,'_').replace(/^_+/gi,'')] = properties_flatten[column]);

            geojson.features.push(newFeature);

            return geojson;
        }, {
            "type": "FeatureCollection",
            "features": []
        });

        exportShapefileDirectly(this.props.fileName, geojson , epsg);
    }

    render(){
        const {header,body,results,exportColumns} = this.props;
        if(!results.length) return null;


        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]);

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);

        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const resultsBody = results.map(row => {
            const newRow = [];
            //get bodyColumns using rowIndex
            bodyColumnsIndex.map(i => newRow.push(body[row.rowIndex][i]));

            const result = flattenFields(row);
            resultColumns.map(i => result[i] || result[i] === 0 ? newRow.push(result[i]) : newRow.push(''));
            
            return newRow;
        });

        const onRowClick = (row,i) => {
            if(this.props._handleEditorOpen){
                if(results[i].error && !['STREET COMBINATION NOT UNIQUE','ACCESS BY NODE FAILED - NODE NOT FOUND'].includes(results[i].error )) return this.props._handleEditorOpen(results[i].debug, results[i].error, results[i].rowIndex);     
            }else if(this.props.zoomToLocation){
                if(results[i].error) return this.props.zoomToLocation();
                
                return this.props.zoomToLocation([parseFloat(results[i].Latitude), parseFloat(results[i].Longitude)]);
            }else{
                return null;
            }
        }

        const tableBody = resultsBody.map((row,i)=> {
            //case to filter for ONLY errors
            if(this.state.filterError){
                if(results[i].error && !['STREET COMBINATION NOT UNIQUE','ACCESS BY NODE FAILED - NODE NOT FOUND'].includes(results[i].error )){
                    return(
                        <Table.Row 
                            key={`pbody-${i}`} 
                            negative={Boolean(results[i].error)}
                            onClick={() => onRowClick(row, i)}
                        >
                            <Table.Cell key={`pbody-${i}-i`}>{i+1}</Table.Cell>
                            {row.map((cell,i2) => <Table.Cell key={`pbody-${i}-${i2}`}>{cell}</Table.Cell>)}
                        </Table.Row>       
                    );
                }else{
                    return null;
                }
            }else{
                return(
                    <Table.Row 
                        key={`pbody-${i}`} 
                        negative={Boolean(results[i].error)}
                        onClick={() => onRowClick(row, i)}
                    >
                        <Table.Cell key={`pbody-${i}-i`}>{i+1}</Table.Cell>
                        {row.map((cell,i2) => <Table.Cell key={`pbody-${i}-${i2}`}>{cell}</Table.Cell>)}
                    </Table.Row>       
                );
            }
        });


        return(
            <React.Fragment>
                <Export history={this.props.history} type={this.props.type || 'block'} _downloadExcel={this._downloadExcel} _downloadShape={this._downloadShape} exportColumns={this.props.exportColumns}>
                    <Checkbox toggle label="Filter Errors" checked={this.state.filterError} onChange={() => this.setState({filterError : !this.state.filterError})}/>
                    
                </Export>
                <div className='table-preview'>
                    <h3>Results</h3>
                    <Table celled striped compact selectable>
                        <Table.Header>
                            <Table.Row key={`rheader`}>
                                <Table.HeaderCell  key={`rheader-index`}>#</Table.HeaderCell >
                                {exportColumnsTrue.map((cell,i2) => <Table.HeaderCell key={`rheader-${i2}`}>{cell}</Table.HeaderCell>)}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tableBody}
                        </Table.Body>
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}

export default BlockTableResult;