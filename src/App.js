import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage, StoryDetail, SignUp, SignIn, ForgotPassword } from './pages';
import { StoriesProvider } from './context';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <StoriesProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/story/:id" element={<StoryDetail />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>
        </Router>
      </StoriesProvider>
    </AuthProvider>
  );
}

export default App;
