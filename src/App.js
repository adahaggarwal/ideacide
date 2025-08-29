import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage, StoryDetail, Stories, SignUp, SignIn, ForgotPassword, Sandbox, Chatbot, CreateStory, Profile } from './pages';
import { StoriesProvider } from './context';
import { AuthProvider } from './context/AuthContext';
import AuthRedirectHandler from './components/AuthRedirectHandler';

function App() {
  return (
    <AuthProvider>
      <StoriesProvider>
        <Router>
          <AuthRedirectHandler>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/story/:id" element={<StoryDetail />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/create-story" element={<CreateStory />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </AuthRedirectHandler>
        </Router>
      </StoriesProvider>
    </AuthProvider>
  );
}

export default App;
