# 1. Connect to MySQL
mysql -u root -p

# 2. Use the correct database
USE cinema_ebooking_platform;

# 3. Find the user ID you want to promote (example: using email)
SELECT user_id, email, role FROM users WHERE email = 'eman@gmail.my';

# 4. Update the user's role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'eman@gmail.my';

# 5. Add them to the admins table (replace 1 with the actual user_id)
INSERT INTO admins (admin_id) VALUES (1);

# 6. Verify the changes
SELECT user_id, email, role FROM users WHERE email = 'eman@gmail.my';
SELECT * FROM admins WHERE admin_id = 1;