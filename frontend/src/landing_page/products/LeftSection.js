import React from 'react';

function LeftSection({ imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore }) {
   return (
      <div className='container mt-5'>
         <div className='row'>
            <div className='col-6'>
               <img src={imageURL}/>
            </div>


            <div className='col-6 mt-5'>
               <h1>{productName}</h1>
               <p>{productDescription}</p>
               <div>
                  <a href={tryDemo}>TryDemo                     
                  </a>
                  <a href={learnMore} style={{ marginLeft: "100px" }}>learnMore                
                  </a>
               </div>
               <div className='mt-3'>
                  <a href={googlePlay}><img src="media/images/googlePlayBadge.svg" alt="Google Play Badge" /></a>
                  <a href={appStore}><img src="media/images/appStoreBadge.svg" alt="App Store Badge" style={{ marginLeft: "20px" }} /></a>
               </div>
            </div>
         </div>
      </div>
   );
}

export default LeftSection;