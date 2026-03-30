create database if not exists cinema_ebooking_platform;

use cinema_ebooking_platform;

create table if not exists movies (
    movie_id int auto_increment,
    title varchar(100) not null,
    user_score int,
    director varchar(100),
    producer varchar(100),
    description varchar(1000),
    rating enum('g', 'pg', 'pg_13', 'r', 'nc_17'),
    duration_mins int,
    release_date date,
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

create table if not exists showrooms (
    room_id int auto_increment,
    room_name varchar(20) unique not null,
    total_seats int,
    primary key (room_id)
); 

create table if not exists shows (
    showtime_id int auto_increment,
    movie_id int not null,
    showtime time not null,
    showdate date not null,
    showroom_id int,
    primary key (showtime_id),
    foreign key (movie_id) references movies(movie_id),
    foreign key (showroom_id) references showrooms(room_id),
    unique (showtime, showdate, showroom_id)
);

create table if not exists seats (
    seat_id int auto_increment,
    row_label varchar(10),
    seat_number int,
    showroom_id int,
    primary key (seat_id),
    foreign key (showroom_id) references showrooms (room_id) on delete cascade,
    unique (row_label, seat_number, showroom_id)
);

create table if not exists bookings (
    booking_id int auto_increment,
    booking_number varchar(20) not null,
    booking_date datetime,
    total_amount decimal(6,2) not null,
    online_booking_fee decimal (4,2),
    tax decimal(5,2),
    payment_reference varchar(100) not null,
    status enum('pending', 'confirmed', 'cancelled'),
    show_id int,
    primary key (booking_id),
    foreign key (show_id) references shows (show_id)
);

create table if not exists tickets (
    ticket_id int auto_increment,
    ticket_number varchar(50),
    ticket_type enum('adult', 'senior', 'child'),
    base_price decimal(15,2),
    booking_id int,
    primary key (ticket_id),
    foreign key (booking_id) references bookings (booking_id) on delete cascade
);

create table if not exists promotions (
    promo_id int auto_increment,
    promo_code varchar(50),
    discount_percent decimal(5,2),
    start_date date,
    end_date date,
    is_active boolean,
    primary key(promo_id)
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
    password_reset_token varchar(255),
    password_reset_token_expiry timestamp,
    promotions_enabled boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    primary key (user_id)
);

create table if not exists addresses (
    address_id int auto_increment,
    user_id int not null,
    address_line1 varchar(100) not null,
    address_line2 varchar(100),
    city varchar(50) not null,
    state varchar(30) not null,
    postal_code varchar(20) not null,
    country varchar(50) not null,
    primary key (address_id),
    foreign key (user_id) references users(user_id) on delete cascade
);

create table if not exists favorite_movies (
    favorite_id int auto_increment,
    user_id int not null,
    movie_id int not null,
    primary key (favorite_id),
    foreign key (user_id) references users(user_id) on delete cascade,
    foreign key (movie_id) references movies(movie_id) on delete cascade,
    unique (user_id, movie_id)
);

create table if not exists actors (
    actor_id int auto_increment,
    first_name varchar(50),
    last_name varchar(50),
    primary key (actor_id)
);

create table if not exists movie_cast (
    actor_id int,
    movie_id int,
    primary key (actor_id, movie_id),
    foreign key (actor_id) references actors(actor_id),
    foreign key (movie_id) references movies(movie_id)
);

create table if not exists reviews (
    review_id int auto_increment,
    review varchar(1500),
    movie_id int,
    user_id int,
    primary key (review_id),
    foreign key (movie_id) references movies(movie_id),
    foreign key (user_id) references users(user_id)
);

create table if not exists payment_cards (
    card_id int auto_increment,
    user_id int not null,
    card_type varchar(20) not null,
    card_number varchar(19) not null,
    card_holder_name varchar(100) not null,
    expiry_month int not null,
    expiry_year int not null,
    cvv varchar(255),
    last_four varchar(4),
    created_at timestamp default current_timestamp,
    primary key (card_id),
    foreign key (user_id) references users(user_id) on delete cascade
);
