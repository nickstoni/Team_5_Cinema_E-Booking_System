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
    movie_id int not null,
    showtime time not null,
    showdate date not null,
    primary key (showtime_id),
    foreign key (movie_id) references movies(movie_id)
);

create table if not exists users (
    user_id int auto_increment,
    full_name varchar(100) not null,
    email varchar(100) not null unique,
    phone_number varchar(20) not null,
    password_hash varchar(255) not null,
    status varchar(20) not null default 'INACTIVE',
    address_line_1 varchar(255),
    address_line_2 varchar(255),
    city varchar(100),
    state varchar(50),
    postal_code varchar(20),
    country varchar(100),
    email_verified boolean default false,
    email_verification_token varchar(255),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (user_id)
);

create table if not exists payment_cards (
    card_id int auto_increment,
    user_id int not null,
    card_type varchar(20) not null,
    card_number varchar(19) not null,
    card_holder_name varchar(100) not null,
    expiry_month int not null,
    expiry_year int not null,
    created_at timestamp default current_timestamp,
    primary key (card_id),
    foreign key (user_id) references users(user_id) on delete cascade
);