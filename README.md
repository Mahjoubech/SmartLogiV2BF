# SmartLogi V2 - Frontend Application

This is the Angular frontend application for the SmartLogi V2 Logistics Management System. It provides a modern, responsive interface for managing shipments, delivery agents (Livreurs), and tracking operations.

## 🚀 Technology Stack

- **Framework**: Angular 16+
- **Styling**: TailwindCSS (v3) with PostCSS
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **Icons**: Heroicons (via SVG)

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Login**: Role-based authentication (Manager, Livreur, Client).
- **Guards**: Protected routes ensuring only authorized users access specific dashboards.
- **Social Login**: Structure for OAuth2 integration.

### 📊 Manager Dashboard
- **Shipment Management**:
  - **Filter View**: Toggle between "All", "Ready" (Unassigned), and "Assigned" shipments.
  - **Assignment**: interactive modal to assign eligible Livreurs based on Zone.
  - **Tracking**: View full history of parcel status changes.
- **Personnel Management**:
  - View list of all Delivery Agents.
  - **Create Agent**: Modal form to register new Livreurs with auto-assigned zones.

### 🚚 Livreur (Courier) Dashboard
- **Task Management**: View assigned parcels ("To Collect", "To Deliver").
- **Status Updates**: Update parcel status (e.g., "Picked Up", "Delivered", "Returned to Stock") with comments.
- **Notifications**: Real-time alerts for new assignments.
- **History**: View past deliveries.

### 📦 Client/Public Features
- **Home Page**: Modern landing page with service overview.
- **Parcel Creation**: Step-by-step wizard for clients to create new shipment requests.

## 🛠️ Setup & Installation

1.  **Prerequisites**: Node.js (v16+) and npm.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`.

## 🔄 Recent Updates & Workflow Improvements

- **Assignment Logic**:
  - **"Ready" State**: Parcels are marked "Ready" when created (`CREE`) or returned to warehouse (`EN_STOCK`).
  - **Auto-Unassign**: When a Livreur marks a parcel as `EN_STOCK`, they are automatically unassigned, making the parcel available for re-assignment.
- **Visual Feedback**:
  - Added "Ready" badges with pulse animation for urgent attention.
  - Clickable "Assigned Agent" cards in the Manager view.
- **Data Integrity**:
  - Fixed Backend-Frontend mapping to ensure `Livreur` details appear correctly in lists.

## 📂 Project Structure

- `src/app/Modules`: Contains feature modules (Auth, Dashboard, Home).
- `src/app/Core`: Singleton services (AuthService, ColisService), Guards, and Interceptors.
- `src/app/Shared`: Reusable components (Navbar, Footer, Loaders).
