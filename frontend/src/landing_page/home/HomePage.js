import React from 'react';
import Education from './Education';
import Hero from './Hero';
import Pricing from './Pricing';
import Awards from './Awards';
import Stats from './Stats';
import OpenAccount from '../OpenAccount';
import Footer from '../Footer';

import Navbar from '../Navbar';
function HomePage() {
    return ( 
        <>
            
            <Hero/>
            <Awards/>
            <Stats/>
            <Pricing/>
            <Education/>
            <OpenAccount/>
            
        </>
     );
}

export default HomePage;