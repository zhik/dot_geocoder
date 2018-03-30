import React, {Component} from 'react';
import { Checkbox } from 'semantic-ui-react';
import { flatten } from 'flat';

class ColumnsPicker extends Component {

    _toggle = column => {
        this.props._updateExportColumn(column);
    }


    render(){
        if(!this.props.results.length) return null;

    
        const sample = this.props.results.find(i => !i.error) || [];
        const rcolumns = flatten(sample, { maxDepth: 2 })
        const frcolumns = Object.keys(rcolumns).filter(i => typeof(rcolumns[i]) !== 'object');
            
        const columns = [...this.props.header, ...frcolumns].map( i => (
                <Checkbox key={`hp-${i}`} label={i} onChange={() => this._toggle(i)} checked={this.props.exportColumns[i]}/>
        ));

        return (
            <div className="picker">
                <h3>Export Columns</h3>
                {columns}
            </div>
        )
    }
}

export default ColumnsPicker;