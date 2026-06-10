"""
Database Seeder for Civic Platform — Veles and Skopje Pilot
Run: python -m app.seed
"""

import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models.city import City
from app.models.municipality import Municipality
from app.models.municipality_employee import MunicipalityEmployee
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.municipality_category_routing import MunicipalityCategoryRouting
from app.core.security import hash_password

CITIES = [
    {"name": "Veles", "country": "Macedonia"},
    {"name": "Skopje", "country": "Macedonia"},
]

MUNICIPALITIES = [
    {"name": "Veles", "city": "Veles"},
    {"name": "Centar", "city": "Skopje"},
    {"name": "Gazi Baba", "city": "Skopje"},
    {"name": "Aerodrom", "city": "Skopje"},
    {"name": "Butel", "city": "Skopje"},
    {"name": "Caska", "city": "Veles"},
    {"name": "Karpos", "city": "Skopje"},
    {"name": "Kisela Voda", "city": "Skopje"},
    {"name": "Gjorce Petrov", "city": "Skopje"},
    {"name": "Saraj", "city": "Skopje"},
    {"name": "Cair", "city": "Skopje"},
    {"name": "Suto Orizari", "city": "Skopje"},
    {"name": "Aracinovo", "city": "Skopje"},
    {"name": "Zelenikovo", "city": "Skopje"},
    {"name": "Ilinden", "city": "Skopje"},
    {"name": "Petrovec", "city": "Skopje"},
    {"name": "Sopiste", "city": "Skopje"},
    {"name": "Studenicani", "city": "Skopje"},
    {"name": "Cucer Sandevo", "city": "Skopje"},
]

CATEGORIES = [
    {
        "name": "Дупки на патот",
        "description": "Оштетени коловози, дупки, искршен асфалт",
    },
    {
        "name": "Ѓубре и нечистотија",
        "description": "Нелегални депонии, ѓубре на јавни површини",
    },
    {"name": "Осветлување", "description": "Прегорени или неисправни улични светилки"},
    {
        "name": "Нелегално паркирање",
        "description": "Возила паркирани на тротоари, пешачки премини, забранети зони",
    },
    {
        "name": "Оштетена инфраструктура",
        "description": "Скршени клупи, огради, патни знаци, тротоари",
    },
    {
        "name": "Зеленило",
        "description": "Непокосена трева, паднати дрвја, занемарени паркови",
    },
    {
        "name": "Водовод и канализација",
        "description": "Скршени цевки, поплави, непријатни миризби",
    },
]

ROUTING = [
    {
        "category": "Дупки на патот",
        "email": "komunalna@veles.gov.mk",
        "dept": "ЈП Комуналец",
    }
]

USERS = [
    {
        "email": "admin@app.mk",
        "password_raw": "admin123",
        "full_name": "Супер Администратор",
        "role": UserRole.superadmin,
    },
    {
        "email": "admin@veles.mk",
        "password_raw": "admin123",
        "full_name": "Кристијан Карбевски",
        "role": UserRole.municipality_admin,
    },
    {
        "email": "admin@skopje.mk",
        "password_raw": "admin123",
        "full_name": "Владимир Цунгаровски",
        "role": UserRole.municipality_admin,
    },
    {
        "email": "graganin@test.mk",
        "password_raw": "Test123!",
        "full_name": "Тест Граѓанин",
        "role": UserRole.citizen,
    },
]

MUNICIPALITY_EMPLOYEES = [
    {"user_id": 2, "municipality_id": 1, "department": "Општинска администрација"},
    {"user_id": 3, "municipality_id": 2, "department": "Општинска администрација"},
]


async def seed():
    async with AsyncSessionLocal() as db:
        print("\n🌱 Starting full database seed...")

        # 1. Cities
        city_map = {}
        for c in CITIES:
            existing = await db.execute(select(City).where(City.name == c["name"]))
            city = existing.scalar_one_or_none()
            if not city:
                city = City(**c)
                db.add(city)
                await db.flush()
            city_map[city.name] = city
            print(f"   ✓ City: {city.name}")

        # 2. Municipalities
        mun_map = {}
        for m in MUNICIPALITIES:
            target_city = city_map.get(m["city"])
            existing = await db.execute(
                select(Municipality).where(Municipality.name == m["name"])
            )
            mun = existing.scalar_one_or_none()
            if not mun:
                mun = Municipality(name=m["name"], city_id=target_city.id)
                db.add(mun)
                await db.flush()
            mun_map[m["name"]] = mun
            print(f"   ✓ Municipality: {mun.name}")

        # 3. Categories
        cat_map = {}
        for c in CATEGORIES:
            existing = await db.execute(
                select(Category).where(Category.name == c["name"])
            )
            cat = existing.scalar_one_or_none()
            if not cat:
                cat = Category(**c)
                db.add(cat)
                await db.flush()
            cat_map[cat.name] = cat
            print(f"   ✓ Category: {cat.name}")

        # 4. Routing
        for r in ROUTING:
            cat = cat_map.get(r["category"])
            mun = mun_map.get("Veles")
            if cat and mun:
                existing = await db.execute(
                    select(MunicipalityCategoryRouting).where(
                        MunicipalityCategoryRouting.category_id == cat.id,
                        MunicipalityCategoryRouting.municipality_id == mun.id,
                    )
                )
                if not existing.scalar_one_or_none():
                    routing = MunicipalityCategoryRouting(
                        category_id=cat.id,
                        municipality_id=mun.id,
                        routing_email=r["email"],
                        department_name=r["dept"],
                    )
                    db.add(routing)
                    print(f"   ✓ Routing: {r['category']} -> {mun.name}")

        # 5. Users
        for u in USERS:
            existing = await db.execute(select(User).where(User.email == u["email"]))
            user = existing.scalar_one_or_none()
            if not user:
                final_password = hash_password(u["password_raw"])
                user = User(
                    email=u["email"],
                    password=final_password,
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True,
                )
                
                db.add(user)
                await db.flush()
                print(f"   ✓ User: {user.email}")

        # 6. Employees
        for e in MUNICIPALITY_EMPLOYEES:
            existing = await db.execute(
                select(MunicipalityEmployee).where(
                    MunicipalityEmployee.user_id == e["user_id"],
                    MunicipalityEmployee.municipality_id == e["municipality_id"],
                )
            )
            if not existing.scalar_one_or_none():
                db.add(MunicipalityEmployee(**e))
                print(f"   ✓ Employee linked: user {e['user_id']}")

        await db.commit()
        print("\n✅ Database perfectly synced!")


async def main():
    try:
        await seed()
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())