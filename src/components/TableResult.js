import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'
import { flatten } from 'flat';

import exportExcel from '../helpers/exportExcel';
import exportShapefile from '../helpers/exportShapefile';
import Export from './Export';

class TableResult extends Component {

    _downloadExcel = () => {
        const {header,body,results,exportColumns} = this.props;

        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]) 

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);
        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const resultsBody = body.map((row, rowIndex) => {
            const newRow = [];

            //push select columns
            bodyColumnsIndex.map(i => newRow.push(row[i]));
            const result = flatten(results[rowIndex], { maxDepth: 2 });
            resultColumns.map(i => result[i] ? newRow.push(result[i]) : newRow.push(''));

            return newRow
        })
        exportExcel([exportColumnsTrue, ...resultsBody]);
    }

    _downloadShape = () => {
        const {header,body,results,exportColumns} = this.props;

        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]) 

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);
        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const resultsBody = body.map((row, rowIndex) => {
            const newRow = [];

            //push select columns
            bodyColumnsIndex.map(i => newRow.push(row[i]));
            const result = flatten(results[rowIndex], { maxDepth: 2 });
            resultColumns.map(i => result[i] ? newRow.push(result[i]) : newRow.push(''));

            return newRow
        })

        exportShapefile(exportColumnsTrue, resultsBody)
    }


    render(){
        const {header,body,results,exportColumns} = this.props;
        if(!results.length) return null;


        //filter for only true exportColumns
        const exportColumnsTrue = Object.keys(exportColumns).filter(i => exportColumns[i]) 

        const bodyColumns = exportColumnsTrue.filter(i => header.indexOf(i) > -1);
        const resultColumns = exportColumnsTrue.filter(i => header.indexOf(i) === -1);
        const bodyColumnsIndex = Object.keys(bodyColumns).map(field => header.indexOf(bodyColumns[field]));

        const resultsBody = body.map((row, rowIndex) => {
            const newRow = [];

            //push select columns
            bodyColumnsIndex.map(i => newRow.push(row[i]));
            const result = flatten(results[rowIndex], { maxDepth: 2 });
            resultColumns.map(i => result[i] ? newRow.push(result[i]) : newRow.push(''));

            return newRow
        })

        const tableBody = resultsBody.map((row,i)=> {
            return(
                <Table.Row 
                    key={`pbody-${i}`} 
                    positive={!results[i].error}
                    negative={Boolean(results[i].error)}
                >
                    <Table.Cell key={`pbody-${i}-i`}>{i+1}</Table.Cell>
                    {row.map((cell,i2) => <Table.Cell key={`pbody-${i}-${i2}`}>{cell}</Table.Cell>)}
                </Table.Row>       
            );
        });


        return(
            <React.Fragment>
                <Export _downloadExcel={this._downloadExcel} _downloadShape={this._downloadShape} exportColumns={this.props.exportColumns}/>
                <div className='table-preview'>
                    <h3>Results</h3>
                    <Table celled striped selectable compact>
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

export default TableResult;