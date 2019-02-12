import React from 'react';
import { List, Label, Header, Segment } from 'semantic-ui-react'

const versions = {
    'Upcoming' : ['more custom error handling'],
    'release v1.1b' : ['added warning for segment level errors','shapefile will now only include features with geography, to avoid processing errors'],
    'release v1.1' : ['extended Block Stretch functions','fixing errors now saves','excel tab support'],
    'release v1.0 (10/11/18)' : ['bug fixes'],
    'alpha v0.3 working editor! (5/3/18)': ['a working editor', 'handling compass direction errors', 'handling for field errors'],
    'alpha v0.2 somewhat stable (4/16/18)' : ['localstorage for results, in case of crash','added nav, about','added maps (preview of results)','helpers for Boroughs added, so now numbers, single and two digit letters can be used (e.g. 2, X, BX for Bronx)','filter for errors toggle for results'],
    'alpha v0.1 very buggy (4/4/18)' : ['added options to export either 2263 or 4326'],
    'init (3/29/18)' : ['init features for react version'],
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