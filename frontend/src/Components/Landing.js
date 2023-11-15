import React from 'react'
import Navigation from './Navigation'

const Landing = () => {
    return (
        <div className='h-screen w-auto flex flex-col'>
            <Navigation/>
            <div className='landingmain w-auto flex flex-col overflow-auto border-2 border-black absolute inset-0 -z-10 h-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]'>
        
            </div>
        </div>
    )
}

export default Landing