USE cinema_ebooking_platform;

-- Populating movies table
insert into movies (title, rating, description, poster, trailer, show_availability) values ('The Shawshank Redemption', 87, 'A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.', 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_FMjpg_UX1200_.jpg', 'https://www.youtube.com/watch?v=PLl99DlL6b4', 'current');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('The Godfather', 87, 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.', 'https://www.themoviedb.org/t/p/w1280/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'https://www.youtube.com/watch?v=Ew9ngL1GZvs', 'current');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('The Godfather Part II', 86, 'In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York. In the 1950s, Michael Corleone attempts to expand the family business into Las Vegas, Hollywood and Cuba.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg', 'https://www.youtube.com/watch?v=7pfqivkYUlE', 'upcoming');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('Schindler''s List', 86, 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', 'https://www.youtube.com/watch?v=v0RB-3sWbBA', 'current');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('12 Angry Men', 86, 'The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors'' prejudices and preconceptions about the trial, the accused, and each other.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg', 'https://www.youtube.com/watch?v=TEN-2uTi2c0', 'current');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('Selena Gomez: My Mind & Me', 85, 'After years in the limelight, Selena Gomez achieves unimaginable stardom. But just as she reaches a new peak, an unexpected turn pulls her into darkness. This uniquely raw and intimate documentary spans her six-year journey into a new light.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/usJxHVxT70lAA7AynnZlmPth7R3.jpg', 'https://www.youtube.com/watch?v=of32sI9jw5Q', 'upcoming');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('Spirited Away', 85, 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', 'https://www.youtube.com/watch?v=GAp2_0JJskk', 'upcoming');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('The Dark Knight', 85, 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://www.youtube.com/watch?v=vbjYVETxZqM', 'upcoming');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('Dilwale Dulhania Le Jayenge', 85, 'Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has left for India to be married to her childhood fiancé. Raj leaves for India with a mission at his hands, to claim his lady love under the noses of her whole family. Thus begins a saga.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/2CAL2433ZeIihfX1Hb2139CX0pW.jpg', 'https://www.youtube.com/watch?v=_ZaPIKNg_EQ', 'upcoming');
insert into movies (title, rating, description, poster, trailer, show_availability) values ('The Green Mile', 85, 'A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people''s ailments. When the cell block''s head guard, Paul Edgecomb, recognizes Coffey''s miraculous gift, he tries desperately to help stave off the condemned man''s execution.', 'https://media.themoviedb.org/t/p/w600_and_h900_face/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg', 'https://www.youtube.com/watch?v=Bg7epsq0OIQ', 'current');

-- Populating genres table
insert into genres (genre_name) values ('adventure'); -- 1
insert into genres (genre_name) values ('action'); -- 2
insert into genres (genre_name) values ('drama'); -- 3
insert into genres (genre_name) values ('comedy'); -- 4
insert into genres (genre_name) values ('thriller'); -- 5
insert into genres (genre_name) values ('suspense'); -- 6
insert into genres (genre_name) values ('horror'); -- 7
insert into genres (genre_name) values ('romance'); -- 8
insert into genres (genre_name) values ('documentary'); -- 9
insert into genres (genre_name) values ('fantasy'); -- 10
insert into genres (genre_name) values ('crime'); -- 11
insert into genres (genre_name) values ('history'); -- 12
insert into genres (genre_name) values ('war'); -- 13
insert into genres (genre_name) values ('music'); -- 14
insert into genres (genre_name) values ('animation'); -- 15
insert into genres (genre_name) values ('family'); -- 16

-- Populating movie_genres table
insert into movie_genres (movie_id, genre_id) values (1, 3);
insert into movie_genres (movie_id, genre_id) values (1, 11);
insert into movie_genres (movie_id, genre_id) values (2, 3);
insert into movie_genres (movie_id, genre_id) values (2, 11);
insert into movie_genres (movie_id, genre_id) values (3, 3);
insert into movie_genres (movie_id, genre_id) values (3, 11);
insert into movie_genres (movie_id, genre_id) values (4, 3);
insert into movie_genres (movie_id, genre_id) values (4, 12);
insert into movie_genres (movie_id, genre_id) values (4, 13);
insert into movie_genres (movie_id, genre_id) values (5, 3);
insert into movie_genres (movie_id, genre_id) values (6, 9);
insert into movie_genres (movie_id, genre_id) values (6, 14);
insert into movie_genres (movie_id, genre_id) values (7, 15);
insert into movie_genres (movie_id, genre_id) values (7, 16);
insert into movie_genres (movie_id, genre_id) values (7, 10);
insert into movie_genres (movie_id, genre_id) values (8, 2);
insert into movie_genres (movie_id, genre_id) values (8, 11);
insert into movie_genres (movie_id, genre_id) values (8, 5);
insert into movie_genres (movie_id, genre_id) values (9, 4);
insert into movie_genres (movie_id, genre_id) values (9, 3);
insert into movie_genres (movie_id, genre_id) values (9, 8);
insert into movie_genres (movie_id, genre_id) values (10, 3);
insert into movie_genres (movie_id, genre_id) values (10, 10);
insert into movie_genres (movie_id, genre_id) values (10, 11);

-- Populating showtimes table
insert into showtimes (movie_id, showtime, showdate) values (1, '14:00:00', '2026-02-26');
insert into showtimes (movie_id, showtime, showdate) values (1, '16:30:00', '2026-02-26');
insert into showtimes (movie_id, showtime, showdate) values (2, '13:45:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (2, '18:30:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (3, '19:45:00', '2026-02-28');
insert into showtimes (movie_id, showtime, showdate) values (3, '17:00:00', '2026-03-01');
insert into showtimes (movie_id, showtime, showdate) values (4, '19:45:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (4, '18:45:00', '2026-03-02');
insert into showtimes (movie_id, showtime, showdate) values (5, '20:00:00', '2026-02-28');
insert into showtimes (movie_id, showtime, showdate) values (5, '17:00:00', '2026-03-01');
insert into showtimes (movie_id, showtime, showdate) values (6, '14:45:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (6, '16:30:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (7, '18:45:00', '2026-03-01');
insert into showtimes (movie_id, showtime, showdate) values (7, '13:30:00', '2026-02-28');
insert into showtimes (movie_id, showtime, showdate) values (8, '17:00:00', '2026-02-26');
insert into showtimes (movie_id, showtime, showdate) values (8, '19:45:00', '2026-03-01');
insert into showtimes (movie_id, showtime, showdate) values (9, '16:30:00', '2026-02-26');
insert into showtimes (movie_id, showtime, showdate) values (9, '17:00:00', '2026-02-27');
insert into showtimes (movie_id, showtime, showdate) values (10, '18:00:00', '2026-02-28');
insert into showtimes (movie_id, showtime, showdate) values (10, '21:30:00', '2026-02-28');
