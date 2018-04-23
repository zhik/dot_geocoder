import React from 'react';
import { NavLink } from 'react-router-dom'
import { Header, Label, Menu } from 'semantic-ui-react'
import logo from '../css/dot_logo_web.png';

const Navbar = ({location}) => {

    return(
        <Header as='h4' attached='top'>
            <img className='logo' src={logo} alt='dot-logo'/> 
            web batch geocoder 
            <Label color='olive'>
            alpha v0.3
            <Label.Detail>working editor!</Label.Detail>
            </Label>
            <div className='nav-links'>
                <Menu pointing size='mini' color='teal'>
                    <Menu.Item active={location === '/'}>
                        <NavLink to="/">Home</NavLink>
                    </Menu.Item>
                    <Menu.Item active={location === '/map'}>
                        <NavLink to="/map">Map</NavLink>
                    </Menu.Item>
                    <Menu.Item active={location === '/about'}>
                        <NavLink to="/about">About</NavLink>
                    </Menu.Item>
                </Menu>
            </div>
        </Header>
    )
}

export default Navbar