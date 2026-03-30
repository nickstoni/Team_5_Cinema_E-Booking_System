# Demo Setup & Execution Guide

## Overview
This guide provides step-by-step instructions for executing the Cinema E-Booking System demo with all 10 test cases.

---

## Pre-Demo Setup (Before Presentation)

### 1. Start the Backend Server
```bash
cd backend
./mvnw spring-boot:run
```
**Expected Output:** Server starts on `http://localhost:8080`

### 2. Verify Backend is Running
```bash
curl http://localhost:8080/api/hello
# Should return: "Backend is working!"
```

### 3. Start the Frontend Application
```bash
cd frontend
npm start
```
**Expected Output:** Frontend opens at `http://localhost:3000`

---

## Demo Test Cases & Execution

### TC1: Create User Account (Registration)

**Requirement:** Registration

**Test Case:** Create a new user account with:
- No payment cards
- No address
- User opted in for promotions

**Test Data:**
```
First name: Eman
Last name: Saleh
Email: eman@gmail.my
Password: MyPass!20
Confirm Password: MyPass!20
Phone: 555-0123
Promotions: Checked (YES)
```

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Fill in all fields with test data above
3. Click "Sign Up"

**Expected Result:**
- ✅ Account is created successfully
- ✅ User is NOT logged in (account is unverified)
- ✅ Confirmation email message displayed: "Registration successful. Please check your email to verify your account."
- ✅ User status = INACTIVE (database check optional)
- 📧 Verification email sent to eman@gmail.my

**Note:** The email service is configured. Check terminal logs for email verification token or database for `email_verification_token`.

---

### TC2: Login with Unverified Account

**Requirement:** Login

**Test Case:** Attempt to log in using an unverified account

**Test Data:**
```
Email: eman@gmail.my
Password: MyPass!20
```

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email and password from TC1
3. Click "Login"

**Expected Result:**
- ✅ System displays error message: "Email not verified. Please verify your account before logging in."
- ✅ Login is denied
- ✅ User remains on login page

---

### TC3: Verify Account

**Requirement:** Registration / Login

**Test Case:** Verify the account using the email verification link

**Steps:**

**Option A: Via Database (Fastest for Demo)**
```sql
-- Run this in your MySQL client:
USE cinema_ebooking_platform;
UPDATE users SET email_verified = true, status = 'ACTIVE' 
WHERE email = 'eman@gmail.my';
```

**Option B: Via Backend API**
1. Find the verification token from the database:
   ```sql
   SELECT email_verification_token FROM users WHERE email = 'eman@gmail.my';
   ```
2. Call the verify endpoint:
   ```bash
   curl -X POST "http://localhost:8080/api/auth/verify-email?token=<TOKEN>"
   ```

**Expected Result:**
- ✅ Account becomes ACTIVE
- ✅ User receives welcome email
- ✅ User can now login

---

### TC4: Login with Verified User Account

**Requirement:** Login

**Test Case:** Login with verified account

**Test Data:**
```
Email: eman@gmail.my
Password: MyPass!20
```

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter the verified account credentials
3. Click "Login"

**Expected Result:**
- ✅ Successful login
- ✅ Redirected to home page (`/`)
- ✅ Profile button visible in navbar
- ✅ User can see movie catalog

---

### TC5: Invalid Login Attempt

**Requirement:** Login

**Test Case:** Login with incorrect password

**Test Data:**
```
Email: eman@gmail.my
Password: WrongPassword123
```

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter email with wrong password
3. Click "Login"

**Expected Result:**
- ✅ Error message displayed: "Invalid email or password"
- ✅ Login is denied
- ✅ User remains on login page

---

### TC6: Login with Admin Account ⭐

**Requirement:** Login (Admin Role)

**Test Case:** Login with admin account

**Setup - Create Admin Account:**

**Option A: Create via API (Full Demo Flow)**
1. Sign up as admin at `http://localhost:3000/signup`:
   ```
   First Name: Admin
   Last Name: User
   Email: admin@cinema.com
   Password: AdminPass!123
   Phone: 555-0000
   Promotions: No
   ```

2. Verify the account (use TC3 Option A or B)

3. Update role to ADMIN in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@cinema.com';
   ```

**Option B: Pre-Create Admin (Faster)**
```sql
-- Insert directly if needed:
INSERT INTO users (
  first_name, last_name, email, phone_number, password_hash, role, status,
  email_verified, promotions_enabled, created_at, updated_at
) VALUES (
  'Admin', 'User', 'admin@cinema.com', '555-0000',
  '$2a$10$NR7x3PuQUXSn3EYJIVv.RuxUxw/FWHZxKyZO1Rq6h5HFiKdKmTMeW',
  'ADMIN', 'ACTIVE', true, false, NOW(), NOW()
);
```

**Test Data:**
```
Email: admin@cinema.com
Password: AdminPass!123
```

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter admin credentials
3. Click "Login"

**Expected Result:**
- ✅ Successful login
- ✅ Redirected to Admin Dashboard (`/admin`)
- ✅ "Admin Dashboard" button visible in navbar
- ✅ Admin sees:
  - Dashboard tab with user/movie statistics
  - Users tab showing all users with management options
  - Movies tab showing all movies
- ✅ Can activate/deactivate users

---

### TC7: Edit Profile (Constraint Validation) - 3 Payment Cards

**Requirement:** Edit Profile

**Setup:**
1. Create a verified user for this test:
   ```
   First Name: Jane
   Last Name: Cards
   Email: cards@cinema.com
   Password: CardsPass!123
   Phone: 555-0002
   ```
2. Verify the account (TC3)
3. Log out admin and log in as this user

**Test Case:** Edit profile with 3 payment cards

**Steps:**
1. Navigate to `/profile` (or click "Profile" button)
2. Scroll to "Payment Cards" section
3. Add Card 1:
   - Card Type: Visa
   - Card Number: 4111 1111 1111 1111
   - Cardholder Name: Jane Cards
   - Expiry: 12/2026
   - CVV: 123
   - Click "Add Card"
4. Add Card 2: (Use Mastercard: 5555 5555 5555 4444)
5. Add Card 3: (Use Amex: 3782 822463 10005)

**Expected Result:**
- ✅ All 3 cards added successfully
- ✅ Cards display with last 4 digits only (encrypted)
- ✅ Can update/delete existing cards
- ✅ Email field is NOT editable
- ✅ Attempt to add 4th card shows error: "Users cannot store more than 3 payment cards."

---

### TC8: Add Movie to Favorites

**Requirement:** Edit Profile (Favorites)

**Test Case:** Add a movie to favorites from browsing page

**Steps:**
1. Stay logged in as the user from TC7 (or TC4)
2. Navigate to home page (`/`)
3. Browse available movies
4. Click on any movie (e.g., "The Shawshank Redemption")
5. Look for "Add to Favorites" button (⭐ icon)
6. Click to add to favorites

**Expected Result:**
- ✅ Movie is added to favorites
- ✅ UI reflects the change (button/icon changes state)
- ✅ User can see favorites in their profile

---

### TC9: Favorites Persistence

**Requirement:** Edit Profile

**Test Case:** Logout → Log in again → Verify favorites still exist

**Steps:**
1. After adding favorites in TC8
2. Log out: Click "Log Out" button
3. Log back in with same credentials
4. Navigate to `/profile`
5. Check favorites section

**Expected Result:**
- ✅ Favorites are persisted (stored in database)
- ✅ Same movies appear in profile after re-login
- ✅ Confirms data is saved and retrieved correctly

---

### TC10: Security Validation

**Requirement:** Non-Functional (Security)

**Test Case:** Verify passwords are hashed and payment cards are encrypted

**Steps:**
1. Open MySQL client/workbench for your database
2. Connect to database: `cinema_ebooking_platform`

**Check Password Hashing:**
```sql
SELECT email, password_hash FROM users WHERE email = 'eman@gmail.my';
-- Password should be bcrypt hash (starts with $2a$10$)
-- Should NOT be plain text
```

**Check Payment Card Encryption:**
```sql
SELECT card_holder_name, card_number, last_four, cvv FROM payment_cards 
WHERE user_id = (SELECT user_id FROM users WHERE email = 'cards@cinema.com');
-- card_number: Should be encrypted (not readable)
-- last_four: Should show only last 4 digits (readable)
-- cvv: Should be encrypted (not readable)
```

**Alternative - Check Specific User by ID:**
```sql
SELECT card_holder_name, card_number, last_four, cvv FROM payment_cards 
WHERE user_id = 1;
-- Replace 1 with the actual user_id
-- Same expectations: card_number and cvv encrypted, last_four readable
```

**Expected Result:**
- ✅ Passwords are hashed using BCrypt (format: $2a$10$...)
- ✅ Payment card data is encrypted
- ✅ Only last 4 digits stored in plain text
- ✅ No sensitive data is readable

---

## Demo Readiness Checklist

Before presenting, verify:

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Database running with `cinema_ebooking_platform` schema
- [ ] Demo user accounts created and verified (or ready to create)
- [ ] Admin account created and role set to ADMIN
- [ ] Email service configured (logs show emails being sent)
- [ ] All endpoints responding correctly
- [ ] Browser console has no errors

---

## Troubleshooting

### Email Verification Not Working
- **Solution:** Check application.properties for email configuration
- Alternatively: Use database UPDATE to set `email_verified = true`

### Admin Dashboard Not Loading
- **Verify steps:**
  1. Check user role in database: `SELECT role FROM users WHERE email = 'admin@cinema.com';`
  2. Confirm role is set to 'ADMIN' (case-sensitive)
  3. Clear browser localStorage and re-login

### Payment Card 3-Limit Not Enforcing
- **Expected:** 4th card shows error "Users cannot store more than 3 payment cards."
- **Check:** Verify ProfileController has: `if (cardCount >= 3) { return badRequest... }`

### Can't Login After TC1
- **Reason:** Account unverified (expected for TC2)
- **Solution:** Use SQL UPDATE to verify or call verify-email endpoint

---

## Demo Flow Summary

```
TC1: Sign Up → TC2: Reject Unverified → TC3: Verify Email
  ↓
TC4: Login Success → TC7: Edit 3 Cards → TC8: Add Favorites → TC9: Persist
  ↓
TC6: Admin Login → TC10: Security Check (DB inspection)
  ↓
TC5: Invalid Password (anytime)
```

**Total Demo Time:** ~20-25 minutes with smooth execution

---

## Completed Backend Implementation

✅ **Model Updates:**
- User model: Added `role` field (USER or ADMIN)
- Database schema: Updated users table with role column

✅ **Controller Updates:**
- AdminController: Full admin endpoints (users, movies, dashboard)
- AuthController: Updated login to return role

✅ **Frontend Updates:**
- AdminDashboard component: Complete admin interface
- App.js: Added /admin route
- Navbar: Added admin button for admin users
- LoginPage: Navigate admin users to /admin after login

✅ **Database Updates:**
- Updated DDL with role column
- Added demo data instructions in cinema_data.sql

---

**Status:** Ready for Demo! 🎬
