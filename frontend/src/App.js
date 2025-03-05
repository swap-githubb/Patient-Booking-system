import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DoctorRegister from './components/Doctor/DoctorRegister';
import DoctorLogin from './components/Doctor/DoctorLogin';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientRegister from './components/Patient/PatientRegister';
import PatientLogin from './components/Patient/PatientLogin';
import PatientDashboard from './components/Patient/PatientDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
