import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home.jsx';
import CountryForm from './components/countryform/CountryForm.jsx';


import './App.css'; // Import CSS for additional styling if needed

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country-form" element={<CountryForm />} /> {/* New route for the form */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;