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
    {"name": "Дупки на патот", "description": "Оштетени коловози, дупки, искршен асфалт"},
    {"name": "Ѓубре и нечистотија", "description": "Нелегални депонии, ѓубре на јавни површини"},
    {"name": "Осветлување", "description": "Прегорени или неисправни улични светилки"},
    {"name": "Нелегално паркирање", "description": "Возила паркирани на тротоари, пешачки премини, забранети зони"},
    {"name": "Оштетена инфраструктура", "description": "Скршени клупи, огради, патни знаци, тротоари"},
    {"name": "Зеленило", "description": "Непокосена трева, паднати дрвја, занемарени паркови"},
    {"name": "Водовод и канализација", "description": "Скршени цевки, поплави, непријатни миризби"},
]


ROUTING = [{"category": "Дупки на патот", "email": "komunalna@veles.gov.mk", "dept": "ЈП Комуналец"}] 


USERS = [
    {"email": "admin@app.mk", "password_hash": "$2b$12$04T1/MnurQnvAGA9N2QbmeBXJrikg8U/RCB7u3w5A6nySBi0EAMBy", "full_name": "Супер Администратор", "role": UserRole.superadmin},
    {"email": "admin@veles.mk", "password_hash": "$2b$12$04T1/MnurQnvAGA9N2QbmeBXJrikg8U/RCB7u3w5A6nySBi0EAMBy", "full_name": "Кристијан Карбевски", "role": UserRole.municipality_admin},
    {"email": "admin@skopje.mk", "password_hash": "$2b$12$04T1/MnurQnvAGA9N2QbmeBXJrikg8U/RCB7u3w5A6nySBi0EAMBy", "full_name": "Владимир Цунгаровски", "role": UserRole.municipality_admin},
    {"email": "graganin@test.mk", "password_raw": "Test123!", "full_name": "Тест Граѓанин", "role": UserRole.citizen},
]

MUNICIPALITY_EMPLOYEES = [
    {"user_id": 2, "municipality_id": 1, "department": "Општинска администрација"},
    {"user_id": 3, "municipality_id": 2, "department": "Општинска администрација"},
]

async def seed():
    async with AsyncSessionLocal() as db:
        print("\n🌱 Starting seed...")

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
            existing = await db.execute(select(Municipality).where(Municipality.name == m["name"]))
            mun = existing.scalar_one_or_none()
            if not mun:
                mun = Municipality(name=m["name"], city_id=target_city.id)
                db.add(mun)
                await db.flush()
            mun_map[m["name"]] = mun
            print(f"   ✓ Municipality: {mun.name}")

        # 3. Categories, Users... (продолжи ја логиката слично како погоре)
        await db.commit()
        print("✅ Success!")

async def main():
    try: await seed()
    finally: await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())