# SENG-384

# 🚀 Full-Stack Web Application with Docker

This project is a full-stack web application designed to manage supplier information. It is fully containerized using **Docker** and follows a **RESTful** architecture for seamless data communication.

---

## 🛠️ Technologies & Features

* **Frontend:** React.js & Axios (Port: 3001)
* **Backend:** Node.js & Express.js (Port: 3000)
* **Database:** PostgreSQL (Port: 5432)
* **Containerization:** Docker & Docker Compose
* **Features:** Dynamic supplier listing, real-time data fetching, and persistent storage.

---

## 📂 Project Structure

```text
project-root/
├── frontend/           # React.js application
│   ├── Dockerfile
│   └── src/
├── backend/            # Express.js API
│   ├── Dockerfile
│   └── src/index.js
├── db/                 # SQL initialization scripts
│   └── init.sql
└── docker-compose.yml  # Multi-container orchestration
```

## ⚙️ Installation & Running the Project
Follow these steps to run the application on your local machine:

1. Clone or Extract the Project
Navigate to the project's root directory (project-root) in your terminal.

2. Run with Docker Compose
Execute the following command to build and start all services (Frontend, Backend, and Database) simultaneously:
```text
docker-compose up --build
```
3. Access the Application

**Frontend:** Open http://localhost:3001 in your browser to use the Supplier Form.

**Backend API:** You can view the stored data (JSON) at http://localhost:3000/api/people.

## 🛰️ API Endpoints

| Method | Endpoint     | Description                                      |
|--------|-------------|--------------------------------------------------|
| GET    | `/api/people` | Fetches all registered suppliers from the database. |
| POST   | `/api/people` | Adds a new supplier to the PostgreSQL database.     |


## 🗄️ Database Initialization

The system automatically creates the **people** table and required schema when the database container starts for the first time. This is handled by the `init.sql` script located in the `db` volume mapping. This ensures the database is ready to use immediately upon startup without manual configuration.

---

## 📝 Features

- ✨ **Dynamic Supplier Listing:** View newly added suppliers instantly on the dashboard without a page refresh.

- 🔗 **Form Validation:** Robust data handling using **Axios** for seamless frontend-backend communication.

- 💾 **Persistent Storage:** Data remains safe in **PostgreSQL** even if containers are stopped or restarted.

- 🐳 **Seamless Setup:** Environment-agnostic and one-command setup via **Docker Compose**.







