import React, {Component} from 'react';
import { Checkbox, Label ,Popup, Icon } from 'semantic-ui-react';
import flattenFields from '../../helpers/flattenFields';

class ColumnsPicker extends Component {

    _toggle = column => {
        this.props._updateExportColumn(column);
    }


    render(){
        if(!this.props.results.length) return null;

    
        const sample = this.props.results.find(i => !i.error) || [];
        const rcolumns = flattenFields(sample)
        const frcolumns = Object.keys(rcolumns).filter(i => typeof(rcolumns[i]) !== 'object');
            
        const columns = [...this.props.header, ...frcolumns].map( (i, n) => (
                <Checkbox key={`hp-${n}`} label={i} onChange={() => this._toggle(i)} checked={this.props.exportColumns[i]}/>
        ));

        return (
            <div className="section">
                <Label as='a' color='olive' ribbon='left'>3</Label>
                <div className="picker">
                    <h3>Export Columns
                        <Popup 
                            position='bottom center' 
                            trigger={<Icon name='question circle outline' />}
                            content={<p>Select the columns you want to view and export to excel or shapefile</p>}
                        />
                    </h3>
                    {columns}
                </div>
            </div>
        )
    }
}

export default ColumnsPicker;