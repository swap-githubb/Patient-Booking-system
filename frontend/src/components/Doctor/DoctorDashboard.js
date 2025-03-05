import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Row, Col, Table, Alert } from 'react-bootstrap';
import api from '../../utils/api';
import moment from 'moment';

function DoctorDashboard() {
  const [availability, setAvailability] = useState({
    city: '',
    state: '',
    schedule: {} // { date: [slot1, slot2, ...] }
  });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  
  const doctorToken = localStorage.getItem('doctorToken');

  // Generate next 7 days for selection for simplicity
  const nextSevenDays = Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  );

  const timeSlots = [
    { id: 'slot1', label: '11am-1pm' },
    { id: 'slot2', label: '3pm-5pm' },
    { id: 'slot3', label: '5pm-7pm' }
  ];

  const handleAvailabilityChange = (date, slot, checked) => {
    setAvailability(prev => {
      const newSchedule = { ...prev.schedule };
      if (!newSchedule[date]) {
        newSchedule[date] = [];
      }
      if (checked) {
        // Only add if not already present
        if (!newSchedule[date].includes(slot)) {
          newSchedule[date].push(slot);
        }
      } else {
        newSchedule[date] = newSchedule[date].filter(s => s !== slot);
      }
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const updateAvailability = async () => {
    try {
      await api.post('/doctors/availability', availability, {
        headers: { Authorization: `Bearer ${doctorToken}` }
      });
      setMessage('Availability updated successfully.');
    } catch (err) {
      setMessage('Failed to update availability.');
    }
  };

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/doctors/appointments', {
        headers: { Authorization: `Bearer ${doctorToken}` }
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  }, [doctorToken]);

  // Fetch doctor's profile to pre-populate availability data
  const fetchDoctorProfile = useCallback(async () => {
    try {
      const res = await api.get('/doctors/profile', {
        headers: { Authorization: `Bearer ${doctorToken}` }
      });
      setAvailability({
        city: res.data.city || '',
        state: res.data.state || '',
        schedule: res.data.schedule || {}
      });
    } catch (err) {
      console.error('Failed to fetch doctor profile', err);
    }
  }, [doctorToken]);

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, [fetchDoctorProfile, fetchAppointments]);

  return (
    <Container className="mt-5">
      <h2>Doctor Dashboard</h2>
      {message && <Alert variant="info">{message}</Alert>}
      
      <h4 className="mt-4">Update Availability</h4>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="city"
                value={availability.city}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state"
                name="state"
                value={availability.state}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <h5 className="mt-4">Select Available Time Slots:</h5>
        {nextSevenDays.map(date => (
          <div key={date} className="mb-3">
            <strong>{date}</strong>
            <div>
              {timeSlots.map(slot => (
                <Form.Check
                  inline
                  key={`${date}-${slot.id}`}
                  label={slot.label}
                  type="checkbox"
                  onChange={(e) => handleAvailabilityChange(date, slot.label, e.target.checked)}
                  checked={availability.schedule[date] && availability.schedule[date].includes(slot.label)}
                />
              ))}
            </div>
          </div>
        ))}
        <Button variant="primary" onClick={updateAvailability}>
          Update Availability
        </Button>
      </Form>

      <h4 className="mt-5">Upcoming Appointments</h4>
      {appointments.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient Name</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{app.patientName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No appointments yet.</p>
      )}
    </Container>
  );
}

export default DoctorDashboard;
