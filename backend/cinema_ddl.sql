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
    password varchar(255) not null,
    promotions_enabled boolean default false,
    status varchar(20) default 'Active',
    primary key (user_id)
);

create table if not exists addresses (
    address_id int auto_increment,
    user_id int not null unique,
    address_line1 varchar(100) not null,
    address_line2 varchar(100),
    city varchar(50) not null,
    state varchar(30) not null,
    postal_code varchar(20) not null,
    country varchar(50) not null,
    primary key (address_id),
    foreign key (user_id) references users(user_id) on delete cascade
);

create table if not exists payment_cards (
    card_id int auto_increment,
    user_id int not null,
    card_type varchar(20) not null,
    card_number varchar(255) not null,
    card_holder_name varchar(100) not null,
    expiry_month varchar(2) not null,
    expiry_year varchar(4) not null,
    cvv varchar(255) not null,
    last_four varchar(4) not null,
    primary key (card_id),
    foreign key (user_id) references users(user_id) on delete cascade
);

create table if not exists favorite_movies (
    favorite_id int auto_increment,
    user_id int not null,
    movie_id int not null,
    primary key (favorite_id),
    unique (user_id, movie_id),
    foreign key (user_id) references users(user_id) on delete cascade,
    foreign key (movie_id) references movies(movie_id) on delete cascade
);