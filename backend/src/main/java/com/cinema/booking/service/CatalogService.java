package com.cinema.booking.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.ShowtimeAvailabilityResponse;
import com.cinema.booking.dto.ShowtimeAvailabilityView;
import com.cinema.booking.dto.ShowtimeResponse;
import com.cinema.booking.dto.ShowtimeVisibilityResponse;
import com.cinema.booking.dto.TicketPriceResponse;
import com.cinema.booking.dto.GenreResponse;
import com.cinema.booking.dto.MovieResponse;
import com.cinema.booking.dto.ShowroomResponse;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.repository.GenreRepository;
import com.cinema.booking.repository.MovieQueryRepository;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.ShowroomRepository;
import com.cinema.booking.repository.ShowtimeRepository;

@Service
public class CatalogService {

    private final MovieRepository movieRepository;
    private final MovieQueryRepository movieQueryRepository;
    private final GenreRepository genreRepository;
    private final ShowroomRepository showroomRepository;
    private final ShowtimeRepository showtimeRepository;
    private final BigDecimal adultTicketPrice;
    private final BigDecimal childTicketPrice;
    private final BigDecimal seniorTicketPrice;

    public CatalogService(
            MovieRepository movieRepository,
            MovieQueryRepository movieQueryRepository,
            GenreRepository genreRepository,
            ShowroomRepository showroomRepository,
            ShowtimeRepository showtimeRepository,
            @Value("${booking.ticket-price.adult:14.99}") BigDecimal adultTicketPrice,
            @Value("${booking.ticket-price.child:10.99}") BigDecimal childTicketPrice,
            @Value("${booking.ticket-price.senior:12.99}") BigDecimal seniorTicketPrice) {
        this.movieRepository = movieRepository;
        this.movieQueryRepository = movieQueryRepository;
        this.genreRepository = genreRepository;
        this.showroomRepository = showroomRepository;
        this.showtimeRepository = showtimeRepository;
        this.adultTicketPrice = adultTicketPrice;
        this.childTicketPrice = childTicketPrice;
        this.seniorTicketPrice = seniorTicketPrice;
    }

    public List<MovieResponse> getMovies(String search) {
        List<Movie> movies;
        if (search == null || search.isBlank()) {
            movies = movieRepository.findAllWithGenres();
        } else {
            movies = movieRepository.searchByTitleWithGenres(search.trim());
        }
        return movies.stream().map(this::toMovieResponse).toList();
    }

    public List<MovieResponse> getMoviesByGenre(String genre) {
        return movieQueryRepository.findMoviesByGenre(genre)
                .stream()
                .map(this::toMovieResponse)
                .toList();
    }

    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genre -> new GenreResponse(genre.getGenreId(), genre.getGenreName()))
                .toList();
    }

    public List<ShowroomResponse> getAllShowrooms() {
        return showroomRepository.findAll().stream()
                .map(showroom -> new ShowroomResponse(
                        showroom.getRoomId(),
                        showroom.getRoomName(),
                        showroom.getTotalSeats()))
                .toList();
    }

    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAllWithMovie()
                .stream()
                .map(this::toShowtimeResponse)
                .toList();
    }

    public List<ShowtimeVisibilityResponse> getShowtimesByMovie(Integer movieId) {
        return showtimeRepository.findVisibilityByMovieId(movieId)
                .stream()
                .map(show -> new ShowtimeVisibilityResponse(
                        show.getShowtimeId(),
                        show.getShowtime(),
                        show.getShowdate(),
                        show.getMovieId(),
                        show.getShowroomName(),
                        show.getTotalSeats(),
                        show.getBookedSeats(),
                        show.getAvailableSeats()))
                .toList();
    }

    public ShowtimeAvailabilityResponse getAvailabilityByShowtime(Integer showtimeId) {
        ShowtimeAvailabilityView availability = showtimeRepository.findAvailabilityByShowtimeId(showtimeId);
        if (availability == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found");
        }

        return new ShowtimeAvailabilityResponse(
                availability.getShowtimeId(),
                availability.getTotalSeats(),
                availability.getBookedSeats(),
                availability.getAvailableSeats());
    }

    public TicketPriceResponse getTicketPrices() {
        return new TicketPriceResponse(adultTicketPrice, childTicketPrice, seniorTicketPrice);
    }

    private MovieResponse toMovieResponse(Movie movie) {
        List<GenreResponse> genres = movie.getGenres() == null
                ? List.of()
                : movie.getGenres().stream()
                        .map(genre -> new GenreResponse(genre.getGenreId(), genre.getGenreName()))
                        .toList();

        return new MovieResponse(
                movie.getMovieId(),
                movie.getTitle(),
                movie.getRating(),
                movie.getRating(),
                movie.getDescription(),
                movie.getPoster(),
                movie.getTrailer(),
                movie.getShowAvailability(),
                movie.getDirector(),
                movie.getProducer(),
                movie.getMpaaRating(),
                movie.getDurationMins(),
                movie.getReleaseDate(),
                genres);
    }

    private ShowtimeResponse toShowtimeResponse(Showtime showtime) {
        return new ShowtimeResponse(
                showtime.getShowtimeId(),
                showtime.getShowtime(),
                showtime.getShowdate(),
                showtime.getDurationMins(),
                showtime.getMovie() != null ? showtime.getMovie().getMovieId() : null,
                showtime.getMovie() != null ? showtime.getMovie().getTitle() : null,
                showtime.getShowroom() != null ? showtime.getShowroom().getRoomId() : null,
                showtime.getShowroom() != null ? showtime.getShowroom().getRoomName() : null,
                showtime.getShowroom() != null ? showtime.getShowroom().getTotalSeats() : null);
    }
}