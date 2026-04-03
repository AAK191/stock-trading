import React from 'react';
import { useNavigate } from "react-router-dom";
function Hero() {
   const navigate = useNavigate();
   const handlesignup = () =>  {
     navigate("/signup");
   }
    return ( 
      <div className='container mb-5 p-5'>
         <div className='row text-center'>
            <img src='media/images/homeHero.png'alt='Hero image' className='mb-5'/>
            <h1 className='mt-5'>Invest in everything</h1>
            <p>Online platform to invest in stocks, derivatives,mutual funds</p>
            <div className="col-12 d-flex justify-content-center mb-5">
              <button className="btn btn-primary fs-5" onClick={handlesignup}>Sign Up</button>
            </div>
         </div>
      </div>
    );
}

export default Hero;
<h1>Hero</h1>