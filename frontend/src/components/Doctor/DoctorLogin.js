import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

function DoctorLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors/login', credentials);
      // Save token (JWT) to localStorage for subsequent authenticated requests
      localStorage.setItem('doctorToken', res.data.token);
      navigate('/doctor/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Doctor Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default DoctorLogin;
