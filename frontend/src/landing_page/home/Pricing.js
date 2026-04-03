import React from 'react';

function Pricing() {
    return ( 
      <div className='container md-5'>
           <div className='row'>
            <div className='col-4'>
              <h1>Unbeatable pricing</h1>
              <p>We poineered the concept of discount broking and price transparency in India. Flat fees and no hidden chrages.</p>
              <a href='' style={{textDecoration:"none"}}>see pricing <i class="fas fa-arrow-circle-right"></i> </a>
            </div>
             <div className='col-2'></div>
             
            
             <div className='col-6 row text-center '>
                  <div className='col p-5 border mb-5'>
                    <h1 className='mb-3'>₹0</h1>
                    <p>Free rquity delivery and <br></br> direct mutual funds</p>
                  </div>

                  <div className='col-6 p-5 border mb-5'>
                    <h1 className='mb-3'>₹20</h1>
                    <p>Intraday and F&O</p>
                  </div>

              </div> 

           </div>
      </div>
    );
}

export default Pricing;
