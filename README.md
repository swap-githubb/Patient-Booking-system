# Doctor-Patient Appointment Portal

A full-stack application for booking appointments between doctors and patients. This application provides two portals:

- **Doctor Portal:** For doctors to register, login, update their availability, and view upcoming appointments.
- **Patient Portal:** For patients to register, login, search for doctors, view available appointment slots (only unbooked slots), book appointments, and cancel appointments.

Email notifications (using Gmail's SMTP via Nodemailer) are sent to both patients and doctors when appointments are booked or cancelled.

## Table of Contents

- [Features](#features)
- [Environment Variables](#environment-variables)
- [Setup and Installation](#setup-and-installation)
- [API Usage Guide](#api-usage-guide)
- [Technologies Used](#technologies-used)
  
## Features

- **Doctor Portal:**  
  - Registration & Login  
  - Update availability (select time slots for upcoming days)  
  - View upcoming appointments with patient details

- **Patient Portal:**  
  - Registration & Login  
  - Search doctors by city, state, speciality, and name  
  - View available appointment slots (only slots not yet booked)  
  - Book and cancel appointments  
  - Receive email confirmations on appointment booking or cancellation

## Environment variables

- MONGO_URI=<your_mongo_atlas_connection_uri>
- JWT_SECRET=<your_jwt_secret>
- PORT=5000

-- #Gmail SMTP configuration
 - SMTP_HOST=smtp.gmail.com
 - SMTP_PORT=587
 - SMTP_SECURE=false
 - SMTP_USER=yourgmail@gmail.com
 - SMTP_PASS=your_generated_app_password
 - SMTP_FROM="yourgmail@gmail.com"


## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed on your machine.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB installation).
- A Gmail account (to send email notifications) with an App Password configured.

### Clone the Repository

```bash
git clone https://github.com/yourusername/doctor-patient-portal.git
cd doctor-patient-portal
```
Keep in mind that after cloning, in frontend -> api.js file change the baseURL to 'http://localhost:5000/api' and backend -> server.js file cors origin to 'http://localhost:3000' 

```bash
cd backend
npm install
npm start
```
Then open another window of command promt and navigate to folder

```bash
cd frontend
npm install
npm start
```

## API Usage Guide

### Authentication


### Doctor Endpoints

- **Register Doctor**
  - **Method:** `POST`
  - **URL:** `/api/doctors/register`
  - **Request Body:**
    ```json
    {
      "name": "Dr. Ashok",
      "speciality": "Cardiology",
      "experience": 10,
      "email": "doctor@mail.com",
      "password": "password"
    }
    ```
- **Doctor Login**
  - **Method:** `POST`
  - **URL:** `/api/doctors/login`
  - **Request Body:**
    ```json
    {
      "email": "doctor@mail.com",
      "password": "password"
    }
    ```
  - **Response:** JWT token is returned upon successful login.
- **Get Doctor Profile**
  - **Method:** `GET`
  - **URL:** `/api/doctors/profile`
  - **Headers:** `Authorization: Bearer <token>`
- **Update Availability**
  - **Method:** `POST`
  - **URL:** `/api/doctors/availability`
  - **Headers:** `Authorization: Bearer <token>`
  - **Request Body:**
    ```json
    {
      "city": "Kanpur",
      "state": "UP",
      "schedule": {
        "2025-03-04": ["11am-1pm", "3pm-5pm"],
        "2025-03-06": ["5pm-7pm"]
      }
    }
    ```
- **Get Upcoming Appointments**
  - **Method:** `GET`
  - **URL:** `/api/doctors/appointments`
  - **Headers:** `Authorization: Bearer <token>`

### Patient Endpoints

- **Register Patient**
  - **Method:** `POST`
  - **URL:** `/api/patients/register`
  - **Request Body:**
    ```json
    {
      "name": "Sam",
      "email": "sam@mail.com",
      "password": "password"
    }
    ```
- **Patient Login**
  - **Method:** `POST`
  - **URL:** `/api/patients/login`
  - **Request Body:**
    ```json
    {
      "email": "sam@mail.com",
      "password": "password"
    }
    ```
- **Get Patient Appointments**
  - **Method:** `GET`
  - **URL:** `/api/patients/appointments`
  - **Headers:** `Authorization: Bearer <token>`

### Appointment Endpoints

- **Book Appointment**
  - **Method:** `POST`
  - **URL:** `/api/appointments/book`
  - **Headers:** `Authorization: Bearer <token>`
  - **Request Body:**
    ```json
    {
      "doctorId": "<doctor_id>",
      "date": "2025-03-06",
      "time": "11am-1pm"
    }
    ```
  - **Note:** On successful booking, email confirmations are sent to both the doctor and patient.
- **Cancel Appointment**
  - **Method:** `DELETE`
  - **URL:** `/api/appointments/:id`
  - **Headers:** `Authorization: Bearer <token>`
  - **Note:** Cancellation also triggers email notifications.
- **Get Booked Appointments for a Doctor**
  - **Method:** `GET`
  - **URL:** `/api/appointments/doctor/:doctorId`
  - **Headers:** `Authorization: Bearer <token>`
    

## Technologies Used
- Frontend: React, React Router, React Bootstrap, Axios
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Nodemailer
- Email Service: Gmail SMTP
