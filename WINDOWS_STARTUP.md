# Windows Environment Startup Guide

## Prerequisites Check
Run this in PowerShell to verify everything is installed:

```powershell
# Check Java
java -version

# Check Maven
mvn -version

# Check Node.js
node --version
npm --version

# Check MySQL
mysql --version
```

---

## Step 1: Start MySQL Service (Windows)

### Option A: Using Services (Recommended)
```powershell
# Open Services Manager
services.msc
```
Find "MySQL80" (or MySQL version) → Right-click → **Start**

### Option B: Using Command Line
```powershell
# Start MySQL service
net start MySQL80

# To stop: net stop MySQL80
```

### Verify MySQL is Running
```cmd
mysql -u root -p
# Enter password: mysqlpass
# Type: exit
```

---

## Step 2: Load Database Schema (First Time Only)

```cmd
cd C:\Users\patri\OneDrive\Desktop\Nick Assignment\Team_5_Cinema_E-Booking_System\backend

# Import schema
mysql -u root -p < cinema_ddl.sql
# Enter password: mysqlpass

# Import sample data
mysql -u root -p < cinema_data.sql
# Enter password: mysqlpass
```

**Verify:**
```cmd
mysql -u root -p
# password: mysqlpass

USE cinema_ebooking_platform;
SHOW TABLES;
# Should see: genres, movie_genres, movies, payment_cards, showtimes, users
```

---

## Step 3: Set Email Environment Variables (Windows)

### Option A: PowerShell (Temporary - for this session only)
```powershell
$env:MAIL_USERNAME="absolutecinemateam5@gmail.com"
$env:MAIL_PASSWORD="eqis tmrd fiie lgkc"

# Verify it's set:
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD
```

### Option B: Command Prompt (Temporary)
```cmd
set MAIL_USERNAME=absolutecinemateam5@gmail.com
set MAIL_PASSWORD=eqis tmrd fiie lgkc

# Verify:
echo %MAIL_USERNAME%
echo %MAIL_PASSWORD%
```

### Option C: Permanent (System Environment Variables)
1. Press `Win + X` → Select **System**
2. Click **Advanced system settings**
3. Click **Environment Variables** button
4. Under "User variables" → Click **New**
   - Variable name: `MAIL_USERNAME`
   - Variable value: `absolutecinemateam5@gmail.com`
5. Click **New** again
   - Variable name: `MAIL_PASSWORD`
   - Variable value: `eqis tmrd fiie lgkc`
6. Click **OK** → **OK** → **OK**
7. **Restart** PowerShell/Command Prompt or IDE for changes to take effect

---

## Step 4: Start Backend (Spring Boot)

Open **PowerShell/Command Prompt** in backend folder:

```cmd
cd C:\Users\patri\OneDrive\Desktop\Nick Assignment\Team_5_Cinema_E-Booking_System\backend
```

### Clean Build
```cmd
mvn clean install
```

### Start Server
```cmd
mvn spring-boot:run
```

**Expected Output:**
```
Started CinemaBookingApplication in X.XXX seconds
```

Server runs on: `http://localhost:8080`

---

## Step 5: Start Frontend (React)

Open **new PowerShell window** in frontend folder:

```cmd
cd C:\Users\patri\OneDrive\Desktop\Nick Assignment\Team_5_Cinema_E-Booking_System\frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view cinema-booking in the browser.
Local:            http://localhost:3000
```

Frontend runs on: `http://localhost:3000`

---

## Testing Registration

### 1. Open Browser
Go to: `http://localhost:3000/signup`

### 2. Fill Registration Form
- Full Name: Test User
- Email: testuser@example.com
- Phone: (555) 123-4567
- Password: TestPassword123
- Confirm Password: TestPassword123
- Optional: Add address, payment cards

### 3. Submit Form
Click "Create Account"

**Expected Response:**
```
"Registration successful. Please check your email to verify your account."
```

### 4. Check Gmail
- Login to: `absolutecinemateam5@gmail.com`
- Look for verification email from Absolute Cinema
- Copy verification link
- Go to link in browser (automatically redirects to login)

---

## How to Check Database for New Users

### Method 1: MySQL Command Line

```cmd
mysql -u root -p
# Enter password: mysqlpass

USE cinema_ebooking_platform;
```

**View all users:**
```sql
SELECT user_id, full_name, email, phone_number, status, email_verified, created_at 
FROM users;
```

**View specific user:**
```sql
SELECT * FROM users WHERE email = 'testuser@example.com';
```

**Check if email is verified (status should be ACTIVE):**
```sql
SELECT user_id, email, status, email_verified FROM users WHERE email = 'testuser@example.com';
```

**View payment cards for a user:**
```sql
SELECT pc.card_id, pc.card_type, pc.card_number, pc.card_holder_name 
FROM payment_cards pc
JOIN users u ON pc.user_id = u.user_id
WHERE u.email = 'testuser@example.com';
```

**Count total registered users:**
```sql
SELECT COUNT(*) as total_users, 
       SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_users,
       SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) as inactive_users
FROM users;
```

### Method 2: MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Click on your connection
3. Double-click `cinema_ebooking_platform` database
4. Right-click `users` table → **Select Rows - Limit 1000**
5. View all registered users

---

## Troubleshooting

### Backend won't start - Port 8080 already in use?
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Get the PID (last column), then kill it:
taskkill /PID <PID_NUMBER> /F

# Or change port in application.properties
```

### Frontend won't start - Port 3000 already in use?
```powershell
$env:PORT=3001
npm start
```

### Email not sending?
1. Verify environment variables are set:
   ```powershell
   echo $env:MAIL_PASSWORD
   ```
2. Check Gmail Account:
   - Two-factor authentication enabled? ✓
   - App password created? ✓
   - Password correct (16 chars)? ✓
3. Check Spring Boot logs for email errors

### Database connection error?
```cmd
# Verify MySQL is running:
netstat -ano | findstr :33306

# Should show LISTENING on port 33306
```

### User created but status is INACTIVE?
This is **normal** - user must verify email first. After clicking verification link, status becomes ACTIVE.

---

## Quick Start Script (Save as `startup.ps1`)

Copy this and save as `startup.ps1` in your project root:

```powershell
Write-Host "Starting Cinema E-Booking System..." -ForegroundColor Green

# Set environment variables
$env:MAIL_USERNAME="absolutecinemateam5@gmail.com"
$env:MAIL_PASSWORD="eqis tmrd fiie lgkc"

# Start MySQL
Write-Host "Starting MySQL..." -ForegroundColor Cyan
net start MySQL80

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; mvn spring-boot:run`""

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm start`""

Write-Host "`nSYSTEM READY!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
```

Run with: `.\startup.ps1`

---

## Next Steps

✅ System is running
✅ Create a test user
✅ Verify email link works
✅ Check database to confirm user and status are correct
✅ Proceed with other features

