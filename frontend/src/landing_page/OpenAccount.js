import React from 'react';
import { useNavigate } from 'react-router-dom';

function OpenAccount() {
   const navigate = useNavigate();
   const handlesignup = () =>  {
     navigate("/signup");
   }

    return (
        <div className='container mb-5 p-5'>
         <div className='row text-center'>
            <img src='media/images/homeHero.png'alt='Hero image' className='mb-5'/>
            <h1 className='mt-5'>Open a Zerodha account</h1>
            <p>Modern platforms and apps, Rs0 investments, and flat Rs20 intraday and FandO trades.</p>
            <div className="col-12 d-flex justify-content-center mb-5">
              <button className="btn btn-primary fs-5" onClick={handlesignup}>Sign up now</button>
            </div>
         </div>
      </div>

      );
}

export default OpenAccount;