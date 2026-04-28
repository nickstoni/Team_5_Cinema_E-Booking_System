package com.cinema.booking.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenreResponse {
        private Integer genreId;
        private String genreName;
}
