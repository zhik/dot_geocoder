import React from 'react';
import { Table } from 'semantic-ui-react'

const TablePreview = ({header, body}) => {
    if(!header.length && !body.length) return null;
    
    //preview first few

    //default to 5 but if length is less than length
    let preview = 5;
    if(body.length < 5) preview = body.length;

    const tableBody = body.slice(0,preview).map((row,i)=> {
        return(
            <Table.Row key={`pbody-${i}`}>
                <Table.Cell key={`pbody-${i}-i`}>{i+1}</Table.Cell>
                {row.map((cell,i2) => <Table.Cell key={`pbody-${i}-${i2}`}>{cell}</Table.Cell>)}
            </Table.Row>       
        );
    });
        

    return (
        <div className='table-preview'>
            <h3>Preview ({preview} of {body.length})</h3>
            <Table celled striped compact>
                <Table.Header>
                    <Table.Row key={`pheader`}>
                        <Table.HeaderCell  key={`pheader-index`}>#</Table.HeaderCell >
                        {header.map((cell,i2) => <Table.HeaderCell key={`pheader-${i2}`}>{cell}</Table.HeaderCell>)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableBody}
                </Table.Body>
            </Table>
        </div>
    )
}

export default TablePreview;
                