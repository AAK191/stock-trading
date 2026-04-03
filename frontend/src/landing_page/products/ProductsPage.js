import React from 'react';
import Hero from './Hero';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import Universe from './Universe';

function ProductsPage() {
    return (
        <>
            <Hero />
            <LeftSection
                imageURL="media/images/kite.png"
                productName="Kite"
                productDescription="Our ultrs-fast flagship trading platform with straming market data,advanced charts, an elegant UI, and more, Enjoy the kite eperience seamlessly on your Andriod and IOS devices."
                tryDemo="https://example.com/try-demo"
                learnMore="https://example.com/learn-more"
                googlePlay="https://example.com/google-play"
                appStore="https://example.com/app-store"
            />
            <RightSection
                imageURL="media/images/console.png"
                productName="Console"
                productDescription="The central dashboard for year Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
                tryDemo="https://example.com/try-demo"
                learnMore="https://example.com/learn-more"
                googlePlay="https://example.com/google-play"
                appStore="https://example.com/app-store"
            />
            <LeftSection
                imageURL="media/images/coin.png"
                productName="Coin"
                productDescription="Buy direct mutual funds online, commission-free,delivered directly directly to your Demat account.Enjoy the investment experience on yoour Andriod and iOS devices."
                tryDemo="https://example.com/try-demo"
                learnMore="https://example.com/learn-more"
                googlePlay="https://example.com/google-play"
                appStore="https://example.com/app-store"
            />

            <RightSection
                imageURL="media/images/kiteconnect.png"
                productName="Kite Connect API"
                productDescription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs.If you are startup,build your investment app and showcase it to our clientbase."
                tryDemo="https://example.com/try-demo"
                learnMore="https://example.com/learn-more"
                googlePlay="https://example.com/google-play"
                appStore="https://example.com/app-store"
            />

            <LeftSection
                imageURL="media/images/varsity.png"
                productName="Varsity mobile"
                productDescription="An easy to grasp ,collection of stock market lessons with in-depth coverage and illustrations.Content is broken down into bite-size cards to help you learn on the go."
                tryDemo="https://example.com/try-demo"
                learnMore="https://example.com/learn-more"
                googlePlay="https://example.com/google-play"
                appStore="https://example.com/app-store"
            />

             <p className='text-center mt-5 mb-5'>want to kknow more about our technology stack? Check out the Zerodha.tech blog</p>
            <Universe/>
        </>
    );
}

export default ProductsPage;