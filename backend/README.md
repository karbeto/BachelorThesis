# 🏛️ Civic Platform — Backend API

FastAPI backend за платформата за граѓански активизам. REST API со PostgreSQL + PostGIS, AI класификација преку OpenAI GPT-4o и автоматско email рутирање до општински служби.

---

## 📋 Содржина

- [Технологии](#технологии)
- [Структура на проектот](#структура-на-проектот)
- [Инсталација](#инсталација)
- [Конфигурација (.env)](#конфигурација-env)
- [База на податоци](#база-на-податоци)
- [Стартување](#стартување)
- [API Ендпоинти](#api-ендпоинти)
- [Автентикација](#автентикација)
- [AI Класификација](#ai-класификација)
- [Email Рутирање](#email-рутирање)
- [Duplicate Detection](#duplicate-detection)
- [Кориснички улоги](#кориснички-улоги)
- [Seeder](#seeder)
- [Тест акаунти](#тест-акаунти)

---

## Технологии

| Пакет | Верзија | Намена |
|---|---|---|
| Python | 3.11+ | Runtime |
| FastAPI | 0.110+ | Web framework |
| SQLAlchemy | 2.0+ | Async ORM |
| Alembic | 1.13+ | Database migrations |
| PostgreSQL | 15+ | Database |
| PostGIS | 3.x | Geospatial operations |
| GeoAlchemy2 | 0.14+ | PostGIS ORM integration |
| Pydantic | v2 | Request/response validation |
| python-jose | 3.3+ | JWT tokens |
| passlib + bcrypt | 1.7.4 / 4.0.1 | Password hashing |
| httpx | 0.27+ | Async HTTP (OpenAI calls) |
| python-multipart | 0.0.9+ | File uploads |
| Uvicorn | 0.29+ | ASGI server |

> ⚠️ **Важно:** Користете `passlib==1.7.4` и `bcrypt==4.0.1` — поновите верзии имаат компатибилитет проблеми.

---

## Структура на проектот

```
backend/
├── app/
│   ├── main.py                     # FastAPI app entry point, CORS, router registration
│   ├── database.py                 # Async SQLAlchemy engine + session factory
│   ├── seed.py                     # Database seeder (Велес пилот)
│   │
│   ├── models/                     # SQLAlchemy ORM модели (14 табели)
│   │   ├── city.py
│   │   ├── municipality.py
│   │   ├── user.py                 # UserRole enum: citizen / municipality_admin / superadmin
│   │   ├── municipality_employee.py
│   │   ├── category.py
│   │   ├── municipality_category_routing.py
│   │   ├── report.py               # ReportStatus enum + GEOMETRY(Point) локација
│   │   ├── report_image.py
│   │   ├── report_status_history.py
│   │   ├── report_vote.py
│   │   ├── report_rating.py
│   │   ├── idea.py
│   │   ├── idea_vote.py
│   │   └── notification.py
│   │
│   ├── schemas/                    # Pydantic v2 request/response шеми
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── report.py               # ReportResponse со category_name + municipality_name
│   │   ├── idea.py
│   │   ├── category.py
│   │   ├── routing.py
│   │   ├── city.py
│   │   ├── municipality.py
│   │   └── notification.py
│   │
│   ├── routers/                    # API endpoints (по функционалност)
│   │   ├── auth.py                 # /auth/register, /auth/login, /auth/me
│   │   ├── users.py                # /users/me, /users/me/password
│   │   ├── cities.py               # /cities CRUD
│   │   ├── municipalities.py       # /municipalities CRUD
│   │   ├── categories.py           # /categories CRUD
│   │   ├── routing.py              # /routing email routing CRUD
│   │   ├── reports.py              # /reports — главен router со AI + PostGIS
│   │   ├── ideas.py                # /ideas CRUD + voting
│   │   ├── votes.py                # /reports/{id}/vote, /ideas/{id}/vote
│   │   ├── ratings.py              # /reports/{id}/rating
│   │   ├── notifications.py        # /notifications
│   │   └── dashboard.py            # /dashboard/stats, /dashboard/heatmap
│   │
│   ├── services/
│   │   ├── ai.py                   # OpenAI GPT-4o vision classification
│   │   └── email.py                # SMTP routing + citizen status emails
│   │
│   └── core/
│       ├── security.py             # hash_password, verify_password, create_token
│       └── dependencies.py         # get_current_user, get_current_admin, get_current_superadmin
│
├── alembic/
│   ├── env.py
│   └── versions/                   # Migration files
│
├── uploads/                        # Прикачени фотографии од пријави
├── .env                            # Environment variables (НЕ се commit-ува)
├── .env.example                    # Template за .env
├── alembic.ini
└── requirements.txt
```

---

## Инсталација

### 1. Клонирање и виртуелна средина

```bash
git clone https://github.com/karbeto/thesis-app.git
cd thesis-app/backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Инсталирање зависности

```bash
pip install -r requirements.txt
```

### 3. PostgreSQL + PostGIS поставување

Во pgAdmin или psql:

```sql
CREATE DATABASE civic_platform;
\c civic_platform
CREATE EXTENSION IF NOT EXISTS postgis;
```

Проверете дека PostGIS е инсталиран:

```sql
SELECT PostGIS_version();
```

### 4. Kreiranje .env фајл

```bash
cp .env.example .env
```

Уредете го `.env` фајлот (видете [Конфигурација](#конфигурација-env)).

### 5. Миграции

```bash
alembic upgrade head
```

### 6. Seeder (тест податоци)

```bash
python -m app.seed
```

### 7. Стартување на серверот

```bash
uvicorn app.main:app --reload --host 0.0.0.0
```

Серверот е достапен на: **http://127.0.0.1:8000**

---

## Конфигурација (.env)

```env
# ── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql+asyncpg://postgres:ВАШАТА_ЛОЗИНКА@localhost:5432/civic_platform

# ── JWT Auth ─────────────────────────────────────────────────────────────────
SECRET_KEY=your-super-secret-key-256-bits-minimum
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120

# ── OpenAI ───────────────────────────────────────────────────────────────────
OPENAI_API_KEY=YOUR_KEY

# ── SMTP (Gmail) ─────────────────────────────────────────────────────────────
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx    # Brevo генерирана лозинка

# ── App ───────────────────────────────────────────────────────────────────────
APP_NAME=Civic Platform API
DEBUG=True                           # False во production
```

### Gmail App Password

Gmail App Password ≠ вашата Gmail лозинка. Се генерира посебно:

1. Google Account → **Security**
2. Овозможете **2-Step Verification**
3. **App Passwords** → Generate → Other → именувајте го "Civic Platform"
4. Копирајте ја генерираната 16-знаковна лозинка во `SMTP_PASSWORD`

---

## База на податоци

### Шема (14 табели)

```
cities
  └─ municipalities
       └─ municipality_employees (link: users ↔ municipalities)
       └─ municipality_category_routing (link: categories ↔ email)
       └─ reports
            └─ report_images
            └─ report_status_history
            └─ report_votes
            └─ report_ratings
       └─ ideas
            └─ idea_votes

users
  └─ notifications
```

### Клучни дизајн одлуки

**PostGIS Geometry колони:**

```python
# report.py — lokacija e GEOMETRY(Point, SRID=4326)
location = Column(Geometry("POINT", srid=4326, spatial_index=False))
```

> `spatial_index=False` е намерно — без тоа Alembic генерира duplicate индекси при секоја миграција.

**Duplicate detection (50м радиус):**

```python
ST_DWithin(
    Report.location,
    ST_GeomFromText(f"POINT({longitude} {latitude})", 4326),
    50  # метри
)
```

**municipality_category_routing junction табела:**

Секоја комбинација категорија + општина → посебна email адреса. Пример:
- Дупки на патот + Општина Велес → `komunalna@veles.gov.mk`
- Дупки на патот + Општина Центар → `komunalna@centar.gov.mk`

---

## Стартување

### Development (со auto-reload)

```bash
uvicorn app.main:app --reload --host 0.0.0.0
```

Флагот `--host 0.0.0.0` е потребен за мобилната апликација да се поврзе од телефон на истата WiFi мрежа.

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Документација (Swagger)

```
http://127.0.0.1:8000/docs       # Swagger UI
http://127.0.0.1:8000/redoc      # ReDoc
```

---

## API Ендпоинти

### Auth — `/auth`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| POST | `/auth/register` | Јавно | Регистрација на граѓанин |
| POST | `/auth/login` | Јавно | Најава, враќа JWT access_token |
| GET | `/auth/me` | Citizen+ | Тековен корисник |

**Пример: Login**
```json
POST /auth/login
{
  "email": "graganin@test.mk",
  "password": "Test123!"
}

Response 200:
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 3,
    "email": "graganin@test.mk",
    "full_name": "Тест Граѓанин",
    "role": "citizen"
  }
}
```

---

### Reports — `/reports`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| POST | `/reports/` | Citizen+ | Поднесување пријава (multipart/form-data) |
| GET | `/reports/` | Јавно | Листа со филтри (municipality_id, category_id, status, skip, limit) |
| GET | `/reports/my` | Citizen+ | Сопствени пријави |
| GET | `/reports/{id}` | Јавно | Детали на пријава |
| PATCH | `/reports/{id}/status` | Admin+ | Промена на статус |
| GET | `/reports/{id}/history` | Јавно | Историја на статуси |
| DELETE | `/reports/{id}` | Citizen (owner) | Бришење — само submitted статус |

**Важно: `/reports/my` мора да биде дефиниран ПРЕД `/{id}`** во routers/reports.py за да нема routing конфликт.

**Пример: Submit report**
```
POST /reports/
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: "Дупка на улица Маршал Тито"
description: "Голема дупка веднаш пред светлото, опасно"
latitude: 41.715
longitude: 21.773
municipality_id: 1
image: <binary>
```

**Response** вклучува `category_name` и `municipality_name` (не само IDs):
```json
{
  "id": 42,
  "title": "Дупка на улица Маршал Тито",
  "status": "submitted",
  "category_id": 1,
  "category_name": "Дупки на патот",
  "municipality_id": 1,
  "municipality_name": "Општина Велес",
  "latitude": 41.715,
  "longitude": 21.773,
  "email_sent": true,
  "is_duplicate": false,
  "vote_count": 0,
  "images": [{"id": 1, "image_url": "/uploads/uuid.jpg", "is_primary": true}],
  "created_at": "2026-05-24T10:30:00Z"
}
```

---

### Dashboard — `/dashboard`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| GET | `/dashboard/stats` | Admin+ | Stats + by_category |
| GET | `/dashboard/heatmap` | Admin+ | Координати за heatmap |

**Role-based филтрирање:**
- `superadmin` → сите општини, без филтер
- `municipality_admin` → само нивната општина (преку `municipality_employees`)

---

### Categories — `/categories`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| GET | `/categories/` | Јавно | Сите активни категории |
| POST | `/categories/` | Superadmin | Додај категорија |
| PATCH | `/categories/{id}` | Superadmin | Уреди (name, description, is_active) |
| DELETE | `/categories/{id}` | Superadmin | Избриши категорија |

---

### Routing — `/routing`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| GET | `/routing/` | Admin+ | Листа (филтер: municipality_id, category_id) |
| POST | `/routing/` | Admin+ | Додај рутирање |
| PATCH | `/routing/{id}` | Admin+ | Уреди (email, department, is_active) |
| DELETE | `/routing/{id}` | Admin+ | Избриши |

---

### Ideas — `/ideas`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| GET | `/ideas/` | Јавно | Листа на идеи |
| POST | `/ideas/` | Citizen+ | Поднеси идеја |
| PATCH | `/ideas/{id}/status` | Admin+ | Промени статус |

---

### Votes — `/reports`, `/ideas`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| POST | `/reports/{id}/vote` | Citizen+ | Гласај за пријава |
| DELETE | `/reports/{id}/vote` | Citizen+ | Тргни глас |
| POST | `/ideas/{id}/vote` | Citizen+ | Гласај за идеја |
| DELETE | `/ideas/{id}/vote` | Citizen+ | Тргни глас |

---

### Ratings — `/reports/{id}/rating`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| POST | `/reports/{id}/rating` | Citizen (owner) | Оцени решена пријава (1-5 + коментар) |

Условот е: корисникот е **сопственик** на пријавата И статусот е **resolved**.

---

### Notifications — `/notifications`

| Метод | Рута | Пристап | Опис |
|---|---|---|---|
| GET | `/notifications/` | Citizen+ | Листа (unread_only param) |
| PATCH | `/notifications/{id}/read` | Citizen+ | Означи како прочитано |
| PATCH | `/notifications/read-all` | Citizen+ | Означи сите |

---

## Автентикација

Системот користи **JWT (JSON Web Tokens)** со HS256 алгоритам.

### Flow

```
1. POST /auth/login → { access_token, user }
2. Зачувај го токенот (expo-secure-store на mobile, localStorage на web)
3. Секој protected request:
   Authorization: Bearer <access_token>
4. Token expires после ACCESS_TOKEN_EXPIRE_MINUTES минути
```

### Dependencies (app/core/dependencies.py)

```python
get_current_user      # Bilo koj logiran korisnik (citizen+)
get_current_admin     # municipality_admin ili superadmin
get_current_superadmin # Samo superadmin
```

### Пример protected endpoint

```python
@router.get("/protected")
async def my_endpoint(
    current_user: User = Depends(get_current_user),
):
    return {"user_id": current_user.id}
```

---

## AI Класификација

Локација: `app/services/ai.py`

### Тек на процесот

```
Citizen поднесува пријава
        ↓
Backend ги вчитува активните категории од БД
        ↓
encode_image_to_base64(image_bytes) — ако има слика
        ↓
classify_report(description, category_names, image_base64)
        ↓
OpenAI GPT-4o API повик
        ↓
JSON response: { category_name, confidence, reasoning }
        ↓
Системот ја наоѓа категоријата во БД и продолжува
```

### Системски промпт

AI е инструиран да одговори **само во JSON формат** со точно еден од дадените имиња на категории. Ако одговорот не може да се парсира, системот **fallback**-ува на `categories[0]`.

### Конфигурација на OpenAI

```python
# app/services/ai.py
MODEL = "gpt-4o"
MAX_TOKENS = 200
TEMPERATURE = 0.1  # Ниска температура = поконзистентни одговори
```

> 💡 Поставете **месечен лимит** во OpenAI Dashboard за да спречите неочекувани трошоци.

---

## Email Рутирање

Локација: `app/services/email.py`

### Два типа на мејлови

**1. Report routing email** — до надлежна општинска служба при поднесување пријава:
```
До: komunalna@veles.gov.mk
Тема: Нова пријава #42 — Дупки на патот — Општина Велес
Содржина: Детали за пријавата + GPS локација + слика (link)
```

**2. Status update email** — до граѓанинот при промена на статус:
```
До: graganin@test.mk
Тема: Статусот на вашата пријава е сменет
Содржина: Пријава #42 е сега во статус: Се решава ✓
```

### Email рутирање логика

Мејлот се испраќа само ако:
1. Пријавата **не е дупликат** (`is_duplicate == False`)
2. Постои активно рутирање во `municipality_category_routing`

---

## Duplicate Detection

### Алгоритам

При секое поднесување, системот проверува дали веќе постои пријава:
- Со **ист тип категорија**
- Во **50 метри радиус**
- Која **не е rejected** и **не е самата дупликат**

```python
ST_DWithin(
    Report.location,          # PostGIS geometry колона
    ST_GeomFromText(wkt, 4326),  # Нова локација
    50                         # 50 метри
)
```

### Последици при дупликат

- `is_duplicate = True`, `parent_report_id` = ID на оригиналот
- **НЕ** се испраќа мејл до општината
- Граѓанинот добива нотификација: *"Сличен проблем веќе е пријавен. Вашиот глас е додаден."*
- На картата дупликатите **не се прикажуваат** (`list_reports` филтрира `is_duplicate == False`)
- На MyReports граѓанинот гo гледа сопствениот duplicate со бадџ "Дупликат"

---

## Кориснички улоги

| Улога | Вредност | Пристап |
|---|---|---|
| Граѓанин | `citizen` | Поднесување пријави, гласање, оценување, идеи |
| Општини Админ | `municipality_admin` | Управување со пријави во сопствената општина, email routing за нивната општина |
| Супер Админ | `superadmin` | Целосен пристап до сè — категории, градови, општини, сите пријави |

### Dependency чекори

```python
# get_current_admin проверува:
# 1. Дали токенот е валиден
# 2. Дали role е municipality_admin ИЛИ superadmin
# Ако не → 403 Forbidden

# get_current_superadmin проверува:
# 1. Дали токенот е валиден
# 2. Дали role е superadmin
# Ако не → 403 Forbidden
```

### Dashboard role-based логика

```python
async def get_municipality_filter(current_user, db) -> int | None:
    if current_user.role == UserRole.superadmin:
        return None  # Нема филтер — гледа сè
    # За municipality_admin — враќа нивниот municipality_id
    employee = await db.execute(
        select(MunicipalityEmployee).where(
            MunicipalityEmployee.user_id == current_user.id
        )
    )
    return employee.municipality_id
```

---

## Seeder

Локација: `app/seed.py`

Seeder-от е **идемпотентен** — може да се стартува повеќе пати без дупликати.

```bash
python -m app.seed
```

### Что се creира

| Тип | Количина | Детали |
|---|---|---|
| Градови | 1 | Велес |
| општини | 1 | Општина Велес |
| Категории | 7 | Дупки, Ѓубре, Осветлување, Паркирање, Инфраструктура, Зеленило, Водовод |
| Email рутирања | 7 | Еден по категорија за Општина Велес |
| Корисници | 3 | superadmin, municipality_admin, citizen |

---

## Тест акаунти

По стартување на seeder-от:

| Улога | Email | Лозинка | Пристап |
|---|---|---|---|
| Супер Админ | `superadmin@civic.mk` | `Admin123!` | Веб-панел — целосен |
| Општина Админ | `admin@veles.gov.mk` | `Veles123!` | Веб-панел — Општина Велес |
| Граѓанин | `graganin@test.mk` | `Test123!` | Мобилна апликација |

---

## Статус кодови

| Код | Значење |
|---|---|
| 200 | Успешен GET/PATCH |
| 201 | Успешно креиран ресурс |
| 204 | Успешно бришење (без тело) |
| 400 | Невалидни параметри / бизнис логика грешка |
| 401 | Невалиден или истечен JWT токен |
| 403 | Недоволни права |
| 404 | Ресурсот не постои |
| 409 | Конфликт — ресурсот веќе постои |
| 422 | Pydantic валидација грешка |

---

## Вчитување на слики

Сликите се зачувуваат во папката `uploads/` и се сервираат staticky:

```python
# app/main.py
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

URL на слика: `http://127.0.0.1:8000/uploads/{uuid}.jpg`

---

## Честите грешки и решенија

**`bcrypt` верзија конфликт:**
```bash
pip install passlib==1.7.4 bcrypt==4.0.1
```

**PostGIS не е инсталиран:**
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

**Alembic duplicate index грешка:**
Проверете дека `spatial_index=False` е поставено на сите `Geometry` колони.

**`/routing` враќа 404:**
Проверете дека routing router е регистриран во `app/main.py`:
```python
from app.routers import routing as routing_router
app.include_router(routing_router.router)
```

**`/reports/my` vraќа грешка:**
Рутата `/reports/my` мора да биде дефинирана **пред** `/{report_id}` во `routers/reports.py`.

**OpenAI грешка при submission:**
Проверете дека `OPENAI_API_KEY` е точен и дека имате кредити на OpenAI акаунтот.