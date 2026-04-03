import React from 'react';

function Stats() {
    return ( 

        <div className='container mt-5 p-3'>
            <div className='row p-3'>
                <div className='col-6 p-3'>
                    <h1>Trust with confidence</h1>
                    <br></br>
                   <div>
                        <h3 className='fs-2 mb-5'>Customer-firt always</h3>
                        <p className='text-muted'>That's why 1.3+crore customers trust Zerodha with 
                         Rs3.5+ lakh crores worth of euity investments.</p>
                    </div>

                   <div>
                        <h3 className='fs-4'>No spam or gimmicks</h3>
                        <p className='text-muted'>No gimmicks,spam,"gamification",or annoying push notification.High quality apps that you usee at your pace,the way you like.</p>
                    </div>

                    <div>
                        <h3 className='fs-4'>The Zerodha universe</h3>
                        <p className='text-muted'>Not just an app, but a whole exosystem.Our investments in 30+ fintech startups offer you tailored services specific to your needs</p>
                    </div>

                    <div >
                        <h3 className='fs-4'>Do better with money</h3>
                        <p className='text-muted'>With initiatives like Nudge and Kill Switch, we don't just facilitate transactions,but actively help you do better with your money.</p>
                    </div>

                </div>
                <div className='col-6 p-5'>
                       <img src='media/images/ecosystem.png' style={{width:"90%"}}/>
                

                <div className='text-center'>
                    <a href='' className='mx-5' style={{textDecoration:"none"}}>Explore our products <i class="fas fa-arrow-circle-right"></i> </a>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href='' style={{textDecoration:"none"}}>Try Kite demo  <i class="fas fa-arrow-circle-right"></i> </a>
                </div>

                </div>
            </div>
        </div>
     );
}

export default Stats;
