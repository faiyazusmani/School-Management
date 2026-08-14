# EduManage Pro — Enterprise Full Stack School SaaS Platform

![License](https://img.shields.io/badge/License-MIT-indigo)
![Version](https://img.shields.io/badge/Version-2.5.0-emerald)
![Build](https://img.shields.io/badge/Production-Ready-purple)

**EduManage Pro** is an enterprise-grade, production-ready School Management SaaS system built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT Authentication**, and **Role-Based Access Control (RBAC)**.

---

## 🌟 Key Features & Enterprise Modules

### 👑 Super Admin & Executive Command Center
- **Institutional Analytics**: Real-time KPI metrics, enrollment trend area charts (Recharts), and revenue growth tracking.
- **18+ Integrated Modules**:
  - **Student Management**: Student enrollment, grade/section assignment, GPA tracking, and modal CRUD operations.
  - **Teacher Directory**: Faculty roster, department assignment, and qualifications catalog.
  - **Parent Directory**: Guardian contact profiles and linked student dependencies.
  - **Classes & Sections**: Homeroom allocations and room capacity management.
  - **Subjects Catalog**: Course codes, credit allocation, and elective/lab classification.
  - **Notice Board**: Role-targeted bulletin announcements (`all`, `students`, `teachers`, `parents`).
  - **Exams & Gradebook**: Exam scheduling and student transcript matrix.
  - **Tuition Fees & Invoices**: Invoice generation, payment status badges (Paid/Pending/Overdue), and digital vouchers.
  - **Library Book Catalog**: ISBN records, borrowing tracking, and shelf locations.
  - **Bus Transport Logistics**: Bus fleet routes, driver phone contacts, and monthly fees.
  - **Admissions Pipeline**: Online student application review with `Approve` and `Reject` decision workflows.
  - **Calendar Event Planner**: Campus calendar, sports meets, and workshop scheduling.
  - **Audit Logs**: System-wide security auditing tracking mutations, IP addresses, and user actions.
  - **Role Permission Matrix**: Fine-grained RBAC matrix editor granting/revoking Read & Write permissions.

### 👩‍🏫 Teacher / Faculty Portal
- Classroom timetable, digital attendance marker, assignment creation, exam grade entry, student roster, and direct parent messaging.

### 🎓 Student Learning Hub
- Subject progress bars, assignment file dropzone, grade history, exam schedule, library search, and tuition statements.

### 👨‍👩‍👧 Parent Observer Portal
- Multi-child progress switcher, daily attendance logs, tuition invoice history, and direct teacher messaging.

### 🪪 Enterprise Document Generators
- **Student ID Card Generator (`IDCardModal.jsx`)**: QR Code rendering, photo, and print layout.
- **Tuition Fee Receipt Generator (`FeeReceiptModal.jsx`)**: Downloadable/printable official fee payment vouchers.
- **Academic Report Card Generator (`ReportCardModal.jsx`)**: Term transcript with GPA calculation and Principal signature block.
- **Global Search Command Palette (`Ctrl + K` / `Cmd + K`)**: Instant search across all records and modules.

---

## 🛠️ Security & Production Best Practices

- **Role-Based Access Control (RBAC)**: Fine-grained middleware authorization (`protect`, `authorize`).
- **Security Headers**: Express Helmet protection and input sanitization.
- **Rate Limiting**: IP rate-limiting guarding API routes against brute-force attacks.
- **Audit Logging**: Automatic action logging for all mutating REST operations (`POST`, `PUT`, `DELETE`).
- **Error Boundary**: React error boundary catching uncaught component exceptions.
- **Swagger Documentation**: Interactive OpenAPI documentation served at `/api/docs`.

---

## 🐳 Docker Deployment Guide

To deploy the full multi-container stack (MongoDB + Express Backend + Nginx Frontend):

```bash
# Build and launch all services in detached mode
docker-compose up -d --build
```

### Stack Endpoints:
- **Frontend App**: `http://localhost:80` (or `http://localhost:5173` in local dev mode)
- **Backend API**: `http://localhost:5000`
- **Swagger API Specs**: `http://localhost:5000/api/docs`

---

## 💻 Local Development Setup

### 1. Backend REST API
```bash
cd backend
npm install
npm start
```

### 2. Frontend React Vite App
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Quick Demo Credentials (Or Use 1-Click Login Buttons)
- **Super Admin**: `admin@edumanage.com` / `password123`
- **Teacher**: `teacher@edumanage.com` / `password123`
- **Student**: `student@edumanage.com` / `password123`
- **Parent**: `parent@edumanage.com` / `password123`

---

## 📜 License
Released under the MIT License. Copyright © 2026 EduManage Pro Inc.
