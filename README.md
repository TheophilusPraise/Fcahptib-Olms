# Fcahptib-Olms
# OLMS - Online Learning Management System

A full-featured Learning Management System (LMS) built with Node.js, Express, MySQL, and EJS. This platform supports student, lecturer, and admin roles and provides tools for managing courses, content, assignments, and virtual learning — all with a clean, responsive user interface.

---
## 🚀 Features

- 👨‍🎓 Multi-role access (Admin, Student, Lecturer)
- 📚 Course and subject management
- 📁 File and material uploads
- 📝 Assignment submissions
- 📅 Timetable/schedule handling
- 📊 Progress tracking and dashboards
- 🔒 Secure login and session handling
- 💬 Real-time announcements / messaging
- 🌐 Responsive EJS-based frontend
- 📦 MySQL database integration with Sequelize ORM

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** EJS (Embedded JavaScript)
- **Database:** MySQL with Sequelize ORM
- **Authentication:** Express Sessions / Passport (optional)
- **Deployment Ready:** Compatible with Render, Railway, Heroku, or VPS

---

## 📁 Project Structure
OLMS/
├── views/ # EJS templates
├── public/ # Static assets (CSS, JS, images)
├── routes/ # Express route controllers
├── models/ # Sequelize models (User, Course, etc.)
├── config/ # DB connection and env
├── server.js # Main application file
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/TheophilusPraise/Fcahptib-Olms.git
cd olms-app

## 2. Install Dependencies
npm install

## 3. Configure Environment Variables
Create a .env file in the root directory:
PORT=   5000
CLIENT_URL=http://localhost:5000

MYSQL_HOST=localhost
MYSQL_USER=OLMS
MYSQL_PASSWORD=
MYSQL_DATABASE=
SESSION_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER= 
SMTP_PASS= 
SESSION_SECRET= 
BBB_URL=""
BBB_SECRET=""

## 4. Run Migrations / Sync Database
Make sure MySQL is running, then:
npm start

Theophilus Praise
Freelancer | Web Developer | Automation Specialist
theophiluspraise67@gmail.com
