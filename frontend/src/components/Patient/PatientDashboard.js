import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import api from '../../utils/api';

function PatientDashboard() {
  const [searchCriteria, setSearchCriteria] = useState({
    city: '',
    state: '',
    speciality: '',
    name: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '' });
  const [doctorBookedSlots, setDoctorBookedSlots] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  
  const patientToken = localStorage.getItem('patientToken');

  const handleSearchChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const searchDoctors = async () => {
    try {
      // The backend should handle filtering by the provided fields in this order: city, state, speciality, name.
      const res = await api.get('/doctors/search', { params: searchCriteria });
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error('Search failed');
    }
  };

  // Wrap fetchAppointments in useCallback so it can be added to useEffect's dependency array
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/patients/appointments', {
        headers: { Authorization: `Bearer ${patientToken}` }
      });
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  }, [patientToken]);

  // Fetch booked slots for selected doctor
  const fetchDoctorBookedSlots = async (doctorId) => {
    try {
      const res = await api.get(`/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${patientToken}` }
      });
      // Group booked slots by date
      const booked = {};
      res.data.appointments.forEach(app => {
        if (!booked[app.date]) {
          booked[app.date] = [];
        }
        booked[app.date].push(app.time);
      });
      setDoctorBookedSlots(booked);
    } catch (err) {
      console.error('Failed to fetch booked slots', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingDetails({ date: '', time: '' });
    // When a doctor is selected, fetch their booked slots
    fetchDoctorBookedSlots(doctor._id);
  };

  // Updated booking section: now filtering out slots that are already booked.
  const submitBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time) {
      setMessage('Please select an available slot.');
      return;
    }
    try {
      await api.post(
        '/appointments/book',
        { doctorId: selectedDoctor._id, ...bookingDetails },
        { headers: { Authorization: `Bearer ${patientToken}` } }
      );
      setMessage('Appointment booked successfully.');
      setSelectedDoctor(null);
      fetchAppointments();
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Failed to book appointment.');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${patientToken}` }
      });
      setMessage('Appointment cancelled.');
      fetchAppointments();
    } catch (err) {
      setMessage('Failed to cancel appointment.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Patient Dashboard</h2>
      {message && <Alert variant="info">{message}</Alert>}
      
      <h4 className="mt-4">Search Doctors</h4>
      <Form>
        <Row>
          <Col md={3}>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={searchCriteria.city}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="state">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={searchCriteria.state}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="speciality">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={searchCriteria.speciality}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="name">
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={searchCriteria.name}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={searchDoctors} className="mt-3">
          Search
        </Button>
      </Form>

      <Row className="mt-4">
        {doctors.map(doctor => (
          <Col md={4} key={doctor._id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Text>
                  Speciality: {doctor.speciality} <br />
                  Experience: {doctor.experience} years <br />
                  City: {doctor.city} <br />
                  State: {doctor.state}
                </Card.Text>
                <Button variant="success" onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedDoctor && selectedDoctor.schedule && (
        <div className="mt-5">
          <h4>Book Appointment with Dr. {selectedDoctor.name}</h4>
          <Form>
            <Form.Label>Select an appointment slot:</Form.Label>
            <div>
              {Object.entries(selectedDoctor.schedule).map(([date, slots]) => {
                // Filter out booked slots (if any) for this date
                const availableSlots = slots.filter(
                  slot => !(doctorBookedSlots[date] && doctorBookedSlots[date].includes(slot))
                );
                if (availableSlots.length === 0) return null;
                return (
                  <div key={date} className="mb-3">
                    <strong>{date}</strong>
                    <div>
                      {availableSlots.map(slot => (
                        <Form.Check
                          key={date + slot}
                          type="radio"
                          label={slot}
                          name="appointmentSlot"
                          value={`${date}__${slot}`}
                          onChange={(e) => {
                            const [selectedDate, selectedTime] = e.target.value.split('__');
                            setBookingDetails({ date: selectedDate, time: selectedTime });
                          }}
                          checked={bookingDetails.date === date && bookingDetails.time === slot}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button 
              variant="primary" 
              onClick={submitBooking} 
              className="mt-3"
              disabled={!bookingDetails.date || !bookingDetails.time}
            >
              Confirm Booking
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedDoctor(null);
                setDoctorBookedSlots({});
              }}
              className="mt-3 ms-2"
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      <h4 className="mt-5">Your Appointments</h4>
      {appointments.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id}>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{app.doctorName}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => cancelAppointment(app._id)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No appointments booked.</p>
      )}
    </Container>
  );
}

export default PatientDashboard;
