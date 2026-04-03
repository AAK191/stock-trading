import React from 'react';

function Universe({imageURL, productName,productDescription, tryDemo, learnMore, googlePlay, appStore}) {
    return (
        <div className='container mt-5'>
            
            <div className='row text-center'>
                <h1>The Zerodha Universe</h1>
                <p>Extend your trading and investment experience even further with our partner platforms.</p>
            </div>
            <div className='row'>
            
            <div className='row p-3 ml-3 text-center'>
                
                <div className='col-4 mt-5 p-3 '>
                    <img src='media/images/smallcaseLogo.png' className='img-fluid' style={{maxWidth:"150px"}}/>
                    <p className='text-small text-muted'>Thematic investment platform</p>
                </div>
                
                <div className='col-4 mt-5 p-3 '>
                    <img src='media/images/streakLogo.png' className='img-fluid' style={{maxWidth:"120px"}}/>
                    <p>Algo & strategy platform</p>
                </div>
                
                <div className='col-4 mt-5 p-3'>
                    <img src='media/images/sensibullLogo.svg' className='img-fluid' style={{maxWidth:"200px"}}/>
                    <br></br>
                    <p>Options trading platform</p>
                </div>
            </div>
            
            <div className='row text-center'>
                <div className='col-4 mt-5'>
                    <img src='media/images/ZerodhaFundhouse.png' className='img-fluid' style={{maxWidth:"150px"}}/>
                    <p>Asset management</p>
                </div>
                
                <div className='col-4 mt-5'>
                    <img src='media/images/goldenpiLogo.png' className='img-fluid' style={{maxWidth:"150px"}}/>
                    <p>Bonds trading platform</p>
                </div>
                
                <div className='col-4 mt-5 mb-5'>
                    <img src='media/images/dittoLogo.png' className='img-fluid' style={{maxWidth:"100px"}}/>
                    <p>ditto platform</p>
                </div>
            </div>

             <div className="col-12 d-flex justify-content-center mb-5 mt-5">
              <button className="btn btn-primary fs-5">Sign up now</button>
            </div>

            </div>
        </div>
    );
}

export default Universe;