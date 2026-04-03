import React from 'react';

function Education() {
    return ( 

        <div className='container mt-5'>
            <div className='row'>
              <div className='col-6'>
                <img src='media/images/education.svg' style={{width:"70%"}}/>
              </div>

              <div className='col-6 p-5'>
                <h1 className='mb-3 fs-2'>Free and open market education</h1>
                <br></br>
                <br></br>
                <br></br>
                 <p className='mt-5'>
                    Varsity, the largest online stock market education book in the world <br></br>
                    covering everything from the basics to advanced trading.
                 </p>
                 <a href='' style={{textDecoration:"none"}}>Versity <i class="fas fa-arrow-circle-right"></i> </a>
                 <br></br>
                 <br></br>
                 <br></br>

                 <p>
                    TradingQ&A, the most active trading and investment community in <br></br>
                    India for all your market related queries
                 </p>
                  <a href='' style={{textDecoration:"none"}}>TadingQ&A <i class="fas fa-arrow-circle-right"></i> </a>
              </div>

            </div>
        </div>
     );
}

export default Education;
