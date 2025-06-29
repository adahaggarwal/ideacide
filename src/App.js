import React from 'react';
import './App.css';
import { Header, Hero, FailureStories, Footer } from './components';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <FailureStories />
      <Footer />
    </div>
  );
}

export default App;
