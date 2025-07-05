import React from 'react';
import { Header, Hero, FailureStories, Footer } from '../../components';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <FailureStories />
      <Footer />
    </div>
  );
};

export default HomePage;
