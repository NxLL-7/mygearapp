# 🚀 GadgetGuy

> **A modern full-stack gadget management platform that helps users organize, document, and manage all of their personal tech devices in one place.**

<p align="center">

![Status](https://img.shields.io/badge/Status-Development-orange)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

---

# 📖 Overview

GadgetGuy is a full-stack web application built to help users maintain a personal inventory of their electronic gadgets.

Instead of managing scattered notes or spreadsheets, GadgetGuy provides a centralized dashboard where users can securely store and organize information about their devices such as laptops, smartphones, cameras, headphones, tablets, gaming consoles, smartwatches, and more.

Each account maintains its own private gadget collection using secure authentication and user-specific data isolation.

---

# ✨ Features

### 🔐 User Authentication

- Secure user registration
- Secure login system
- Password hashing with bcrypt
- JWT Authentication
- Protected API routes
- Session-based user access

### 👤 User Profiles

Every registered user has their own personal gadget collection.

Users can:

- Register an account
- Log in securely
- View their own gadgets
- Add new gadgets
- Edit gadget details
- Delete gadgets

> 🔒 Users can only access their own data.

### 📱 Gadget Management

Store unlimited gadgets with the following information:

- Gadget Name
- Product Name
- Description

Example gadgets:

- Laptop
- Smartphone
- DSLR Camera
- Smartwatch
- Mechanical Keyboard
- Earbuds
- GPU
- Monitor
- Tablet

### ➕ Add Gadgets

- Enter gadget name
- Provide product name
- Add a detailed description
- Save instantly

### ✏️ Update Gadgets

Modify existing gadget information anytime.

Update:

- Gadget Name
- Product Name
- Description

### ❌ Delete Gadgets

Remove gadgets that are no longer owned or needed.

### 📦 PostgreSQL Database

Application data is securely stored in PostgreSQL.

Database stores:

- Users
- Gadgets

using proper relational mapping.

### 🔒 Secure Data Isolation

Every gadget belongs to exactly one user.

```text
User
│
├── Laptop
├── Phone
├── Camera
└── Smartwatch
```

The backend ensures users can only access their own gadgets.

### 🌐 REST API

```http
POST   /register
POST   /login

GET    /gadgets
POST   /gadgets
PUT    /gadgets/:id
DELETE /gadgets/:id
```

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Axios / Fetch API
- CSS
- Responsive Design

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- CORS
- dotenv

## Database

- PostgreSQL
- SQL
- Foreign Keys
- Relational Database Design

---

# 📁 Project Structure

```text
GadgetGuy/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🗄 Database Schema

## Users

| Field | Type |
|-------|------|
| id | SERIAL |
| name | TEXT |
| phone | TEXT |
| username | TEXT |
| password | TEXT |

## Gadgets

| Field | Type |
|-------|------|
| id | SERIAL |
| user_id | INTEGER |
| gadget_name | TEXT |
| gadget_product_name | TEXT |
| gadget_description | TEXT |
| is_Favorite | BOOLEAN |

---

# 🔐 Authentication Flow

```text
Register
    │
    ▼
Password Hashing
    │
    ▼
Store User
    │
    ▼
Login
    │
    ▼
JWT Generated
    │
    ▼
Frontend Stores Token
    │
    ▼
Protected Requests
    │
    ▼
Verify JWT
    │
    ▼
Return User Data
```

---

# 📸 Application Workflow

```text
User Registers
      │
      ▼
User Logs In
      │
      ▼
JWT Generated
      │
      ▼
Dashboard
      │
      ▼
Add Gadget
      │
      ▼
Store in PostgreSQL
      │
      ▼
Display User Gadgets
      │
      ▼
Edit / Delete Anytime
```

---

# 🎯 Current Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Authentication
- ✅ Password Encryption
- ✅ PostgreSQL Database
- ✅ User-specific Gadget Storage
- ✅ Add Gadgets
- ✅ View Gadgets
- ✅ Edit Gadgets
- ✅ Delete Gadgets
- ✅ Responsive Interface
- ✅ Protected Routes

---

# 🎓 Learning Objectives

This project demonstrates knowledge of:

- Full Stack Development
- React Development
- Express.js APIs
- PostgreSQL
- JWT Authentication
- REST API Design
- Database Relationships
- CRUD Operations
- Responsive UI Design
- State Management
- Client-Server Architecture
- Authentication & Authorization

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Developed by Siddhartha**

Computer Science student passionate about:

- Full Stack Development
- Backend Engineering
- Cloud Computing
- Building scalable web applications

---

<div align="center">

## ⭐ Like this project?

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future development.

---

**Built with ❤️ using React, Node.js, Express.js, PostgreSQL, and JWT Authentication.**

</div>
