# Team Setup Guide - Cinema E-Booking System

## Prerequisites
- Java 17+
- Maven
- MySQL 8.0+
- Node.js 16+
- Git

---

## Backend Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Team_5_Cinema_E-Booking_System/backend
```

### 2. Database Setup
```bash
# Start MySQL service
# Import database schema
mysql -u root -p < cinema_ddl.sql
mysql -u root -p < cinema_data.sql
```

### 3. Email Configuration (Each Team Member)
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual Gmail credentials
# Open .env.local and update:
# MAIL_USERNAME=absolutecinemateam5@gmail.com
# MAIL_PASSWORD=your-gmail-app-password
```

**Get Gmail App Password:**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Paste into .env.local

### 4. Set Environment Variables

#### Windows (PowerShell):
```powershell
$env:MAIL_USERNAME="absolutecinemateam5@gmail.com"
$env:MAIL_PASSWORD="your-16-char-password"
```

#### Windows (Command Prompt):
```cmd
set MAIL_USERNAME=absolutecinemateam5@gmail.com
set MAIL_PASSWORD=your-16-char-password
```

#### macOS/Linux:
```bash
export MAIL_USERNAME=absolutecinemateam5@gmail.com
export MAIL_PASSWORD=your-16-char-password
```

### 5. Run Backend
```bash
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd ../frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

Frontend runs on `http://localhost:3000`

---

## Testing Features

### Registration Flow:
1. Go to `http://localhost:3000/signup`
2. Fill in all required fields
3. Check email (verify-email link will be sent)
4. Click verification link
5. Account becomes ACTIVE

### Database Verification:
```sql
-- Check registered users
SELECT user_id, full_name, email, status FROM users;

-- Check payment cards
SELECT * FROM payment_cards;
```

---

## Important Notes

⚠️ **Security:**
- **NEVER commit .env.local** - it's in .gitignore
- **NEVER commit credentials** to application.properties
- Use environment variables or .env.local locally only

✅ **Team Collaboration:**
- Each member has their own local .env.local
- All use the same shared Gmail account (absolutecinemateam5@gmail.com)
- Credentials stay private on each machine

---

## Troubleshooting

### Email not sending?
- Check MAIL_PASSWORD is correct (16 characters, no typos)
- Verify 2FA is enabled on Gmail account
- Check firewall allows outbound port 587

### Database connection error?
- Ensure MySQL is running on port 33306
- Check credentials: user=root, password=mysqlpass
- Verify database exists: `cinema_ebooking_platform`

### Port already in use?
- Backend: Change `server.port` in application.properties
- Frontend: Use `PORT=3001 npm start`

---

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
