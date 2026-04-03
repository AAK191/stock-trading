import React from 'react';

function Hero() {
    return ( 
<section className='container-fluid' id='supportHero'>
    <div className='offset-1'>
        <div className='p-5' id='supportWrapper'>
            <h4>Support Portal</h4>
            <a href=''>Track Tickets</a>
        </div>

        <div className='row p-5 m-3'>        
            <div className='col-4 offset-1 p-3'>
                  <p className='fs-3'>Search for an answer or browse help topics to create a ticket</p>
                  <input placeholder='Eg. how do i activate F&O,why is my order getting rejected.'/>
                  <br></br>
                  <a href=''> Track account opening</a> &nbsp;&nbsp;&nbsp;
                  <a href=''> Track segment activation</a> &nbsp;&nbsp;&nbsp;
                  <a href=''> Intraday margins</a> &nbsp;&nbsp;&nbsp;
                  <a href=''> Kite user manual</a> &nbsp;&nbsp;&nbsp;
            </div>

            <div className='col-6 p-3 offset-1'>
                    <p className='fs-3'>Featured</p>
                    <ol>
                        <li><a href="" style={{lineHeight:"2.5"}}>Current Takeovers and Delisting - January 2024</a></li>
                        <li><a href="" style={{lineHeight:"2.5"}}>Latest Intrady leverages - MIS & CO</a></li>
                    </ol>
            </div>
        
        </div>
        </div>
</section>
     );
}

export default Hero;