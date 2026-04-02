# 1. Connect to MySQL
mysql -u root -p

# 2. Use the correct database
USE cinema_ebooking_platform;

# 3. Find the user ID you want to promote (example: using email)
SELECT user_id, email, role FROM users WHERE user_id = 1;

# 4. Update the user's role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE user_id = 1;

# 5. Add them to the admins table (replace 1 with the actual user_id)
INSERT INTO admins (admin_id) VALUES (1);

# 6. Verify the changes
SELECT user_id, email, role FROM users WHERE user_id = 1;
SELECT * FROM admins WHERE admin_id = 1;

# Commands for deletion

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM payment_cards;
DELETE FROM addresses;
DELETE FROM favorite_movies;
DELETE FROM reviews;
DELETE FROM admins;
DELETE FROM customers;
DELETE FROM users;

ALTER TABLE payment_cards AUTO_INCREMENT = 1;
ALTER TABLE addresses AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE admins AUTO_INCREMENT = 1;
ALTER TABLE customers AUTO_INCREMENT = 1;
ALTER TABLE favorite_movies AUTO_INCREMENT = 1;
ALTER TABLE reviews AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;