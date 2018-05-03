import React from 'react';

const GoogleMapsLink = ({position}) => {
    const coords = `${position[0]},${position[1]}`
    return(
        <a target='_blank' href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords}`}>{coords}</a>
    )
}

export default GoogleMapsLink;