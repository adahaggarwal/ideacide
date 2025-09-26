import React from 'react';
import { Header, Hero, FailureStories, UserStories, Footer, ParticleBackground } from '../../components';

const HomePage = () => {
  return (
    <div className="home-page">
      <ParticleBackground density={30} speed={0.3} />
      <Header />
      <Hero />
      <UserStories />
      <FailureStories />
      <Footer />
    </div>
  );
};

export default HomePage;
