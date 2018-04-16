import React from 'react';
import { List, Label, Header, Segment } from 'semantic-ui-react'

const versions = {
    'upcoming' : ['a working editor'],
    'alpha v0.2 somewhat stable' : ['localstorage of results, in case of crash','added nav','added maps (view results on the map)','added about'],
    'alpha v0.1 very buggy' : ['added options to export either 2263 or 4326'],
    'init' : ['init features'],
}

const ChangeLog = () => {
    return(
        <div className="changelog">
            <h3>Changelog</h3>
            {Object.keys(versions).map(version => (
                <div key={version}>
                    <Header as='h3' attached='top' inverted >
                        <Label>{version}</Label>
                    </Header>
                    <Segment attached>
                        <List bulleted>
                            {versions[version].map((item,i) => (
                                <List.Item key={`${version}-${i}`}>{item}</List.Item>
                            ))}
                        </List>
                    </Segment>
                </div>
            ))}

        </div>
    )
}

export default ChangeLog;