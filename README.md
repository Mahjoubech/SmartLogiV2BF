# SmartLogi V2 - Logistics Management System

SmartLogi V2 is a comprehensive logistics management solution designed to streamline shipping, tracking, and delivery operations. This repository contains the source code for the backend API and two frontend implementations (Angular and React).

## 📂 Project Structure

- **`SmartlogiV2_BackEnd`**: Spring Boot REST API
- **`SmartlogiV2_FrontEnd`**: Angular Frontend Application
- **`SmartlogiV2_FrontReactTs`**: React + TypeScript Frontend Application

---

## 🅰️ SmartLogi V2 - Angular Frontend (`SmartlogiV2_FrontEnd`)

This is the original Angular frontend application for the SmartLogi V2 system. It provides a structured, responsive interface for managing shipments and delivery agents.

### 🚀 Technology Stack
- **Framework**: Angular 16+
- **Styling**: TailwindCSS (v3) with PostCSS
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Icons**: Heroicons (via SVG)

### ✨ Key Features
- **Secure Login**: Role-based authentication (Manager, Livreur, Client).
- **Manager Dashboard**:
  - Filter View: Toggle between "All", "Ready", and "Assigned" shipments.
  - Assignment Modal: Assign eligible Livreurs based on Zone.
  - Tracking: View full history of parcel status changes.
- **Livreur Dashboard**:
  - Task Management: View assigned parcels.
  - Status Updates: Update parcel status (e.g., "Picked Up", "Delivered").
- **Client Features**:
  - Parcel Creation Wizard.
  - Home Page with Service Overview.

### 🛠️ Setup & Installation
1.  **Navigate to Directory**: `cd SmartlogiV2_FrontEnd`
2.  **Install Dependencies**: `npm install`
3.  **Run Development Server**: `ng serve` (http://localhost:4200/)

---

## ⚛️ SmartLogi V2 - React Frontend (`SmartlogiV2_FrontReactTs`)

This is the modern, high-performance React implementation of the frontend, built with TypeScript and Vite for speed and scalability.

### 🚀 Technology Stack
- **Framework**: React 18+
- **Language**: TypeScript (TSX)
- **Build Tool**: Vite
- **Styling**: TailwindCSS (v4)
- **State Management**: Redux Toolkit (Centralized store for Auth, Colis, Livreur)
- **Routing**: React Router v6 (Protected Routes, Role-based Guards)
- **Testing**: Vitest + React Testing Library
- **Containerization**: Docker + Nginx

### ✨ Key Features
- **Authentication**:
  - JWT Authentication with Redux persistence.
  - Role-Based Access Control (RBAC) ensuring secure routing.
- **Dashboards**:
  - **Client**: Track parcels, request new shipments.
  - **Manager**: comprehensive analytics, driver management, and mission assignment.
  - **Driver (Livreur)**: Mobile-first dashboard to view missions, update statuses, and check history.
- **Modern UI/UX**:
  - Glassmorphism design elements.
  - Responsive layouts for all devices.
  - Real-time feedback and notifications.

### 🛠️ Setup & Installation
1.  **Navigate to Directory**: `cd SmartlogiV2_FrontReactTs`
2.  **Install Dependencies**: `npm install`
3.  **Run Development Server**: `npm run dev` (http://localhost:5173/)
4.  **Run Tests**: `npm test`

### 🐳 Docker Usage
To run the React frontend with the Backend using Docker Compose:
```bash
cd SmartlogiV2_BackEnd
docker-compose up --build
```
This will start:
- **Backend API**: http://localhost:8081
- **React Frontend**: http://localhost (Served via Nginx)
- **PostgreSQL**: Port 5432

---

## ☕ SmartLogi V2 - Backend (`SmartlogiV2_BackEnd`)

The core API powering both frontends.

### 🚀 Technology Stack
- **Framework**: Spring Boot 3
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

### 🛠️ Setup
1.  **Configure Database**: Ensure PostgreSQL is running and credentials in `application.properties` match.
2.  **Run Application**: `mvn spring-boot:run`
