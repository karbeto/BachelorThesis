# Civic Activism Platform

## Overview

A full-stack civic engagement platform that connects citizens with municipal services through AI-assisted issue reporting and community-driven local innovation proposals.

Citizens can report urban issues such as:
- Road potholes
- Illegal dumping
- Damaged infrastructure
- Street lighting problems
- Water and sewage issues
- Green space maintenance

The platform automatically classifies reports using OpenAI GPT-4o and routes them to the appropriate municipal department.

---

## Key Features

### Citizen Mobile Application
- Create reports with photos and GPS location
- AI-powered category detection
- Track report status in real time
- Vote on reports
- Submit and vote for local improvement ideas
- Offline report submission queue
- Push notifications

### Municipality Web Dashboard
- Dashboard with statistics and maps
- Report management
- Status updates
- Category management
- Email routing management
- Idea review and moderation

### AI Integration
- OpenAI GPT-4o classification
- Image and text analysis
- Automatic category selection
- Automated department routing

---

## Architecture

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- PostGIS
- JWT Authentication

### Web Panel
- React
- Vite
- TanStack Query
- Zustand
- React Leaflet
- Recharts

### Mobile Application
- React Native
- Expo
- React Navigation
- Expo Camera
- Expo Location
- Expo Secure Store

### External Services
- OpenAI GPT-4o
- Brevo SMTP
- OpenStreetMap

---

## Project Structure

```text
thesis-app/
├── backend/
├── web-panel/
└── mobile/
```

---

## Installation

### Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

python -m seed

uvicorn app.main:app --reload --host 0.0.0.0
```

### Web Panel

```bash
cd web-panel

npm install
npm run dev
```

### Mobile App

```bash
cd mobile

npm install
npx expo start
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=
SECRET_KEY=
OPENAI_API_KEY=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

### Mobile

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
```

---

## Main Functional Flow

1. Citizen submits a report.
2. GPS location is captured.
3. Duplicate detection is performed using PostGIS.
4. GPT-4o classifies the issue.
5. Appropriate department is selected.
6. Email notification is sent.
7. Municipality processes the report.
8. Citizen receives updates.
9. Citizen can rate the resolution.

---

## Database

Main entities:

- Users
- Municipalities
- Cities
- Categories
- Reports
- Report Images
- Report Votes
- Report Ratings
- Ideas
- Idea Votes
- Notifications

---

## Author

**Kristijan Karbevski**

Bachelor Thesis Project  
Brainster Next IT Faculty  
Software Engineering and Innovation

---

## License

This project was developed as part of a bachelor's thesis and is intended for educational and demonstration purposes.
