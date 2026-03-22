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

## ScreenShots 

<p align="center">
  <img width="600" height="500" src="https://github.com/user-attachments/assets/8a650e0d-434c-4423-997b-2c980ac4cb92" />
  <br/>
  <em>Registration Form </em>
</p>
<p align="center">
  <img width="600" height="500" src="https://github.com/user-attachments/assets/ebbf3faa-1a25-4638-ba36-928bbbe0df12" />
  <br/>
  <em> List of People that are registered</em>
</p>
<p align="center">
  <img width="600" height="500" src="https://github.com/user-attachments/assets/713c5998-4c4e-44e7-93ba-3080eb811fe5" />
  <br/>
  <em>The API Endpoints screen displays the structure and description of GET and POST requests within the system.</em>
</p>
<p align="center">
  <img width="600" height="500" src="https://github.com/user-attachments/assets/02ec2b6a-ad7b-41dd-a55e-c6290e8d7e16" />
  <br/>
  <em>Delete button </em>
</p>




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







