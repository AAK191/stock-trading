import React from 'react';

function HeroPage() {
    return ( 
         <div className='container border-bottom mt-5'>
            <div className='text-center mt-5 p-3'>
            <h1>Technology</h1>
            <h3 className='text-muted mt-3 fs-4'>Sleek, modern and intutuive trading platforms</h3>
            <p className='mt-3'>
                Check out our{" "}
                <a href="" style={{textDecoration: "none"}}>
                    investment offerings{" "}
                    <i className='fa fa-long-arrow--right' aria-hidden="true"></i>
                </a>
            </p>
         </div>
         </div>
    );
}

export default HeroPage;