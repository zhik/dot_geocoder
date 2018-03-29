import React from 'react';
import { Table, Icon } from 'semantic-ui-react'

const TablePreview = ({header, body}) => {
    if(!header.length && !body.length) return null;
    
    //preview first few

    //default to 15 but if length is less than length
    let preview = 15;
    if(body.length < 15) preview = body.length;

    const tableBody = body.slice(0,preview).map((row,i)=> {
        return(
            <Table.Row key={`body-${i}`} positive>
                <Table.Cell key={`body-${i}-i`}>{i+1}</Table.Cell>
                {row.map((cell,i2) => <Table.Cell key={`body-${i}-${i2}`}>{cell}</Table.Cell>)}
            </Table.Row>       
        );
    });
        

    return (
        <div className='table-preview'>
            <h3>Preview</h3>
            <Table celled striped selectable compact>
                <Table.Header>
                    <Table.Row key={`header`}>
                        <Table.HeaderCell  key={`header-index`}>#</Table.HeaderCell >
                        {header.map((cell,i2) => <Table.HeaderCell key={`header-${i2}`}><Icon name='attention' />{cell}</Table.HeaderCell>)}
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
                