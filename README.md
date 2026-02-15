# Team_5_Cinema_E-Booking_System

##  Overview

Cinema E-Booking System is a web application that allows users to browse movies, view showtimes, and book tickets online for a modern cinema experience.
---

## Team 5

| Member Name      | GitHub Username      | Role          |
|------------------|----------------------|---------------|
|  Nicolas Santana   |     nickstoni           | Frontend/Database  |
|  Asad Khan   |     Asadak02      | Backend/Frontend   |
|  Jamie Chen |      JamieC003       | Database/Backend    |
|  Thai Hinh Nguyen    |     Thaihinh    | Backend/Frontend |

---

## Project Features

- User Authentication & Authorization (login/sign-up, account management)
- Movie Browsing & Search functionality
- Showtime Scheduling & Theater Selection
- Online Ticket Booking & Seat Selection
- Secure Payment Processing
- Booking History & Email Confirmations
- Admin Panel for movie and showtime management

---

## Repository Structure

```
/backend
  /src/main/java/com/cinema/booking
    CinemaBookingApplication.java → Spring Boot main application
    /controller → REST API controllers
      TestController.java → Test endpoint
    /model → Entity classes (User, Movie, Booking, etc.)
    /repository → Database repositories
    /service → Business logic layer
  /src/main/resources
    application.properties → Spring Boot configuration
  pom.xml → Maven dependencies
/frontend
  /public → Static assets
    index.html → Main HTML file
  /src
    App.js → Main React component
    index.js → Entry point
    /components → React components
    /pages → Page components
    /services → API service layer
  package.json → npm dependencies
```

---

## Tech Stack

| Layer             | Technology                                   |
|-------------------|----------------------------------------------|
| Frontend          | React.js                                     |
| Backend           | Spring Boot (Java)                           |
| Database          | MySQL                                        |
| API               | RESTful API                                  |
| Build Tools       | Maven (Backend), npm (Frontend)              |

---

## Running the Application

### Backend (Spring Boot)

Navigate to the backend directory and run:

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start at: `http://localhost:8080`

### Frontend (React)

In a separate terminal, navigate to the frontend directory and run:

```bash
cd frontend
npm install
npm start
```

The frontend application will start at: `http://localhost:3000`

## Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_booking
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:8080/api
```

---