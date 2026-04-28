package com.cinema.booking.dto.admin;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMovieRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String poster;
    private String trailer;
    private String director;
    private String producer;

    /** MPAA rating: g, pg, pg_13, r, nc_17 */
    private String rating;

    private Integer durationMins;
    private LocalDate releaseDate;

    @NotNull(message = "Show availability is required")
    private String showAvailability; // "current" or "upcoming"

    private List<String> genres;
}
