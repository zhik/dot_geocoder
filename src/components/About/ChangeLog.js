import React from 'react';
import { List, Label, Header, Segment } from 'semantic-ui-react'

const versions = {
    'upcoming' : ['Block functions'],
    'alpha v0.3 working editor!': ['a working editor', 'handling compass direction errors', 'handling for field errors'],
    'alpha v0.2 somewhat stable' : ['localstorage for results, in case of crash','added nav, about','added maps (preview of results)','helpers for Boroughs added, so now numbers, single and two digit letters can be used (e.g. 2, X, BX for Bronx)','filter for errors toggle for results'],
    'alpha v0.1 very buggy' : ['added options to export either 2263 or 4326'],
    'init' : ['init features'],
}

const ChangeLog = () => {
    return(
        <div className="section changelog">
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