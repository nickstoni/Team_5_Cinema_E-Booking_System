package com.cinema.booking.model.catalog;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")
@Data
@EqualsAndHashCode(exclude = "movies")
@ToString(exclude = "movies")
@NoArgsConstructor
@AllArgsConstructor
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer genreId;

    @ManyToMany(mappedBy = "genresSet")

    @JsonIgnore
    private Set<Movie> movies = new HashSet<>();

    private String genreName;
}