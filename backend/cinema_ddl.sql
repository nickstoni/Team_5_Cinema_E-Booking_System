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
    show_id int auto_increment,
    movie_id int not null,
    start_time time not null,
    show_date date not null,
    duration_mins int,
    showroom_id int,
    primary key (show_id),
    foreign key (movie_id) references movies(movie_id),
    foreign key (showroom_id) references showrooms(room_id),
    unique (start_time, show_date, showroom_id)
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
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(100) unique,
    password varchar(150) not null,
    phone_number varchar(15),
    is_verified boolean,
    promo_subscribed boolean,
    primary key (user_id)
);

create table if not exists customers (
    cust_id int,
    status enum('active', 'inactive', 'suspended'),
    preferences varchar(100),
    primary key (cust_id),
    foreign key (cust_id) references users (user_id)
);

create table if not exists admins (
    admin_id int,
    primary key (admin_id),
    foreign key (admin_id) references users (user_id)
);

create table if not exists favorite_movies (
    cust_id int,
    movie_id int,
    primary key (cust_id, movie_id),
    foreign key (cust_id) references customers(cust_id) on delete cascade,
    foreign key (movie_id) references movies(movie_id)
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

create table if not exists addresses (
    address_id int auto_increment,
    street varchar(50),
    city varchar(30),
    state varchar(20),
    zip_code varchar(10),
    country varchar(50),
    primary key (address_id)
);

create table if not exists payment_card (
    card_id int auto_increment,
    card_number varchar(100) not null unique,
    exp_date date not null,
    address_id int not null,
    cust_id int not null,
    primary key (card_id),
    foreign key (address_id) references address(address_id),
    foreign key (cust_id) references customers (cust_id) on delete cascade
);
