import React from 'react';
import NavbarTop from './NavbarTop/NavbarTop';
import NavbarBottom from './NavbarBottom/NavbarBottom';

const Navbar = () => {

    return (
        <nav className="navbar">
            <NavbarTop  />
            <div className="separator"></div>
            {/* <NavbarBottom /> */}
        </nav>
    );
};

export default Navbar;
