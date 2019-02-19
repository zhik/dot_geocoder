import React from 'react';
import { NavLink } from 'react-router-dom'
import { Header, Label, Menu } from 'semantic-ui-react'
import logo from '../css/dot_logo_web.png';

const Navbar = ({location}) => {

    return(
        <Header as='h4' attached='top'>
            <img className='logo' src={logo} alt='dot-logo'/> 
            web batch geocoder 
            <Label color='green'>
            v 1.1c
            </Label>
            <div className='nav-links'>
                <Menu pointing size='tiny' color='teal'>
                    <Menu.Item active={location === '/'}>
                        <NavLink to="/">Home</NavLink>
                    </Menu.Item>
                    <Menu.Item active={location === '/block'}>
                        <NavLink to="/block">Block</NavLink>
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