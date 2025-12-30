import React from 'react'
import Header from '../component/Header.jsx';
import HeroSection from '../component/HeroSection.jsx';
import LogosSection from '../component/logos.jsx';
import ExploreCourses from '../component/explorecourse.jsx';
import Features from '../component/feature.jsx';
import Footer from '../component/footer.jsx';

function Home() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Header/>
      <HeroSection/>
      <LogosSection/>
      <ExploreCourses/>
      <Features/>
      <Footer/>
    </div>  
  )
}

export default Home