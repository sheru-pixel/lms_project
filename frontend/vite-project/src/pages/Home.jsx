import React from 'react'
import Header from '../component/Header.jsx';
import HeroSection from '../component/HeroSection.jsx';
import LogosSection from '../component/logos.jsx';

function Home() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Header/>
      <HeroSection/>
      <LogosSection/>
    </div>  
  )
}

export default Home