package com.cinema.booking.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
        private Integer movieId;
        private String title;
        private Integer rating;
        @JsonProperty("user_score")
        private Integer userScore;
        private String description;
        private String poster;
        private String trailer;
        private String showAvailability;
        private String director;
        private String producer;
        private String mpaaRating;
        private Integer durationMins;
        private LocalDate releaseDate;
        private List<GenreResponse> genres;
}
