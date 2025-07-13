import React from 'react';
import { Header, Hero, FailureStories, UserStories, Footer } from '../../components';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <UserStories />
      <FailureStories />
      <Footer />
    </div>
  );
};

export default HomePage;
