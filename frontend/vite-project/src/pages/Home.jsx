import React from 'react'
import Nav from '../component/Nav.jsx';
import home from '../assets/home1.jpg';

function Home() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Nav/>
        <img src={home} className="object-cover md:object-fill w-full lg:h-full h-[50vh]" alt=""/>
    </div>  
  )
}

export default Home