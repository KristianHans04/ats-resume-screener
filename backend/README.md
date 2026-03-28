# DCIS Backend Architecture

I have successfully implemented the core architecture for the **Dynamic Contextual Inquiry System (DCIS)** using **Django**. The system is modular and supports AI-driven analysis with background processing and hybrid storage.

## Key Components

### 1. User Management & JWT Auth
- **App**: `users`
- **Model**: `User(AbstractUser)` with role choices (`RECRUITER`, `CANDIDATE`).
- **Auth**: Integrated `djangorestframework-simplejwt`.
- **Endpoints**:
    - `POST /api/auth/register/`: Creates a user and returns JWT tokens + role.
    - `POST /api/auth/login/`: Validates credentials and returns JWT tokens + role.

### 2. Job Management
- **App**: `jobs`
- **Model**: `JobDescription` (title, company, description, recruiter FK).
- **CRUD**: Full API at `/api/jobs/`.
- **Permissions**: `IsAuthenticated` (all) + `IsRecruiter` (write access).

### 3. Task Tracking (Celery)
- **Configuration**: `dcis_backend/celery.py` and project-wide integration.
- **Worker**: Redis-backed Celery worker setup.
- **Shared Task**: `simulate_ai_process` for background heavy lifting.
- **Endpoint**: `GET /api/tasks/<task_id>/status/` for real-time progress.

### 4. Hybrid Database Infrastructure
- **Primary (PostgreSQL)**: Configured in `settings.py` for structured data and embeddings (pgvector).
- **Document (MongoDB)**: Created `utils/mongodb_utils.py` using `pymongo` for raw CV text storage.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Python 3.10+
- PostgreSQL (with `pgvector` extension)
- MongoDB
- Redis (for Celery)

### 2. Environment Setup
Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
*(Note: I recommend creating a `requirements.txt` from the currently installed packages)*

### 3. Database Configuration
Update the `DATABASES` setting in `dcis_backend/settings.py` with your credentials or use environment variables.

> [!IMPORTANT]
> **Migration Status**:
> Migrations for `users` and `jobs` have been generated.
> To apply migrations, ensure PostgreSQL and MongoDB are running and properly configured in `settings.py`.

### 4. Running the Application

> [!TIP]
> **Step 1: Start Redis**: Ensure your Redis server is running.
> 
> **Step 2: Start Celery Worker**:
> ```bash
> celery -A dcis_backend worker --loglevel=info
> ```
> 
> **Step 3: Apply Migrations**:
> ```bash
> python manage.py migrate
> ```
> 
> **Step 4: Start Django Server**:
> ```bash
> python manage.py runserver
> ```

---

## Core Technologies
- **Django 5.2**: Web framework
- **Django REST Framework**: API development
- **Simple JWT**: Authentication
- **Celery & Redis**: Background tasks
- **PyMongo**: MongoDB interaction
- **Psycopg2**: PostgreSQL interaction
