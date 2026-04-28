package com.cinema.booking.repository.profile;

import com.cinema.booking.model.profile.FavoriteMovie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteMovieRepository extends JpaRepository<FavoriteMovie, Integer> {
    List<FavoriteMovie> findByUserId(Integer userId);
    Optional<FavoriteMovie> findByUserIdAndMovieId(Integer userId, Integer movieId);
    boolean existsByUserIdAndMovieId(Integer userId, Integer movieId);
}