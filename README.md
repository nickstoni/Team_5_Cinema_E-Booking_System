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
  cinema_data.sql → Sample movie data (10 movies with genres and showtimes)
  /src/main/java/com/cinema/booking
    CinemaBookingApplication.java → Spring Boot main application
    /controller
      MovieController.java → Movie API endpoints (search, genre filter)
      ShowtimeController.java → Showtime API endpoints
      GenreController.java → Genre API endpoints
      TestController.java → Test endpoint
    /model
      Movie.java → Movie entity class
      Showtime.java → Showtime entity class
      Genre.java → Genre entity class
    /repository
      MovieRepository.java → Movie database repository
      MovieQueryRepository.java → Custom movie queries
      ShowtimeRepository.java → Showtime database repository
      GenreRepository.java → Genre database repository
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
    /components → Organized by page/feature
      /booking
        BookingPage.js → Ticket booking page (UI prototype)
        SeatSelection.js → Interactive seat selection component
        TicketPrices.js → Ticket quantity and pricing component
      /home
        HomePage.js → Main landing page with search/filter
        HeroSection.js → Rotating hero slider for featured movies
        MoviesSection.js → Movie grid section (Now Playing/Coming Soon)
        MovieCard.js → Individual movie card component
      /moviedetails
        MovieDetails.js → Movie detail page with trailer and showtimes
        ShowtimeCard.js → Showtime card with booking navigation
      /notfound
        NotFoundPage.js → 404 error page
      /layout
        Navbar.js → Navigation bar with search and genre filter
        Footer.js → Page footer component
      /filters
        GenreFilter.js → Genre dropdown filter component (for future use)
    /styles → Organized by page/feature
      /booking
        BookingPage.css, SeatSelection.css, TicketPrices.css
      /home
        HeroSection.css, MoviesSection.css, MovieCard.css
      /moviedetails
        MovieDetails.css, ShowtimeCard.css
      /notfound
        NotFoundPage.css
      /layout
        Navbar.css, Footer.css
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