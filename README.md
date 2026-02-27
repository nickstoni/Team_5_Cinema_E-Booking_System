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

## Current Tasks

#### Please refer to the [Deliverable](https://uga.view.usg.edu/d2l/lms/dropbox/user/folder_submit_files.d2l?db=4147468&grpid=3873414&isprv=0&bp=0&ou=3859721) for **requirements**

- Nick -> Home Page with movies from the Movie database table
- Thai -> Movie Details (poster, title, rating, description, trailer, showtimes, ...)
- Asad -> Search movies by title
- Asad -> Filter movies by genre or show date
- Nick -> Booking Page (UI Only) to show selected movie and showtime
- Jamie -> Database with at least 10 movies (movies have to include multiple genres, and both states of Coming Soon and Currently Running)

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
  cinema_ddl.sql → Database schema (DDL)
  cinema_data.sql → Sample movie data
  /src/main/java/com/cinema/booking
    CinemaBookingApplication.java → Spring Boot main application
    /controller
      MovieController.java → Movie API endpoints (search, genre filter)
      TestController.java → Test endpoint
    /model
      Movie.java → Movie entity class
    /repository
      MovieRepository.java → Movie database repository
      MovieQueryRepository.java → Custom movie queries
  /src/main/resources
    application.properties → Spring Boot configuration

/frontend
  /public
    index.html → Main HTML file
    /images → Movie posters and assets
  /src
    App.js → Main React component with routing
    App.css → Global styles
    index.js → Entry point
    index.css → Base styles
    /components
      /filters
        GenreFilter.js → Genre dropdown filter component
      /layout
        Navbar.js → Navigation bar with search
        Footer.js → Page footer
      /movies
        HeroSection.js → Rotating hero slider
        MovieCard.js → Individual movie card
        MoviesSection.js → Movie grid section (Now Playing/Coming Soon)
      /pages
        HomePage.js → Main landing page
        MovieDetails.js → Movie detail page with trailer
        BookingPage.js → Ticket booking UI (prototype)
        NotFoundPage.js → 404 page
    /styles → CSS modules for each component
      BookingPage.css
      Footer.css
      HeroSection.css
      MovieCard.css
      MovieDetails.css
      MoviesSection.css
      Navbar.css
      NotFoundPage.css

/public
  /images → Shared image assets
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

### Database Schema

The database includes the following tables:
- **movies** - Movie information (title, rating, description, poster, trailer URL, show_availability)
- **genres** - Genre categories
- **movie_genres** - Many-to-many relationship between movies and genres
- **showtimes** - Upcoming movie showtimes (to be implemented)

---
