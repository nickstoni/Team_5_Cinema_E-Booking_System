create database if not exists cinema_ebooking_platform;

use cinema_ebooking_platform;

create table if not exists movies (
    movie_id int auto_increment,
    title varchar(100) not null,
    rating int,
    description varchar(1000),
    poster varchar(200),
    trailer varchar(500),
    show_availability varchar(20),
    primary key (movie_id)
);

create table if not exists genres (
    genre_id int auto_increment,
    genre_name varchar(30),
    primary key (genre_id),
    unique (genre_name)
);

create table if not exists movie_genres (
    movie_id int,
    genre_id int,
    primary key (movie_id, genre_id),
    foreign key (movie_id) references movies(movie_id),
    foreign key (genre_id) references genres(genre_id)
);

create table if not exists showtimes (
    showtime_id int auto_increment,
    movie_id int,
    showtime time not null,
    showdate date,
    primary key (showtime_id),
    foreign key (movie_id) references movies(movie_id)
);