# Team 5 Cinema E-Booking System

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
  cinema_ddl.sql
  cinema_data.sql
  /src/main/java/com/cinema/booking -> backend Java source code
    /config -> app configuration and startup data
    /controller -> REST API controllers
    /dto -> request and response objects
    /model -> database entity classes
    /repository -> data access interfaces
    /service -> business logic services
    /util -> helper classes
  /src/main/resources -> application settings and resources
    application.properties

/frontend
  /public -> static public files
  /src -> React application source code
    App.js
    App.css
    index.js
    index.css
    /components -> all React components
      /admin -> admin dashboard components
      /booking -> booking and checkout components
      /home -> homepage components
      /layout -> shared layout components
      /login -> login and password reset components
      /moviedetails -> movie detail and showtime components
      /notfound -> 404 page components
      /profile -> user profile components
      /showtimes -> showtimes listing components
      /signup -> sign-up and verification components
      /utils -> shared frontend helper functions
    /styles -> all CSS stylesheets
      /admin -> admin styles
      /booking -> booking styles
      /home -> home page styles
      /layout -> shared layout styles
      /login -> login styles
      /moviedetails -> movie details styles
      /notfound -> not found page styles
      /profile -> profile styles
      /showtimes -> showtimes styles
      /signup -> sign-up styles
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

### Database Setup (MySQL)

1. Create the database and tables:
```bash
cd backend
mysql -u root -p < cinema_ddl.sql
```

2. Load sample movie data:
```bash
mysql -u root -p < cinema_data.sql
```

### Backend (Spring Boot)

Navigate to the backend directory and run:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
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
spring.datasource.url=jdbc:mysql://localhost:3306/cinema_ebooking_platform
spring.datasource.username=root
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
```
