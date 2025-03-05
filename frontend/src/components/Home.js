import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

function Home() {
  const navigate = useNavigate();

  const handleDoctor = () => {
    navigate('/doctor/login');
  };

  const handlePatient = () => {
    navigate('/patient/login');
  };

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">Welcome to Doctor-Patient Portal</h1>
      <Row className="justify-content-md-center">
        <Col md="4">
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>Doctor Portal</Card.Title>
              <Button variant="primary" onClick={handleDoctor} className="w-100">
                Login
              </Button>
              <div className="mt-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/doctor/register')}
                  className="w-100"
                >
                  Register
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card className="mb-3 shadow">
            <Card.Body>
              <Card.Title>Patient Portal</Card.Title>
              <Button variant="primary" onClick={handlePatient} className="w-100">
                Login
              </Button>
              <div className="mt-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/patient/register')}
                  className="w-100"
                >
                  Register
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
