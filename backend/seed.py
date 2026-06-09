"""
Database Seeder for Civic Platform — Veles Pilot
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



CITY = {"name": "Велес", "country": "Macedonia"}

MUNICIPALITY = {"name": "Општина Велес"}

CATEGORIES = [
    {
        "name": "Дупки на патот",
        "description": "Оштетени коловози, дупки, искршен асфалт",
    },
    {
        "name": "Ѓубре и нечистотија",
        "description": "Нелегални депонии, ѓубре на јавни површини",
    },
    {
        "name": "Осветлување",
        "description": "Прегорени или неисправни улични светилки",
    },
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
    },
    {
        "category": "Ѓубре и нечистотија",
        "email": "chistota@veles.gov.mk",
        "dept": "ЈП Чистота",
    },
    {
        "category": "Осветлување",
        "email": "elektro@veles.gov.mk",
        "dept": "Општински Сектор за Енергетика",
    },
    {
        "category": "Нелегално паркирање",
        "email": "soobrakaj@mvr.gov.mk",
        "dept": "МВР Сообраќај Велес",
    },
    {
        "category": "Оштетена инфраструктура",
        "email": "infrastruktura@veles.gov.mk",
        "dept": "Сектор за инфраструктура",
    },
    {
        "category": "Зеленило",
        "email": "zelenilo@veles.gov.mk",
        "dept": "ЈП Паркови и зеленило",
    },
    {
        "category": "Водовод и канализација",
        "email": "vodovod@veles.gov.mk",
        "dept": "ЈП Водовод Велес",
    },
]

USERS = [
    {
        "email": "superadmin@civic.mk",
        "password_raw": "Admin123!",
        "full_name": "Супер Администратор",
        "role": UserRole.superadmin,
    },
    {
        "email": "admin@veles.mk",
        "password_hash": "$2b$12$04T1/MnurQnvAGA9N2QbmeBXJrikg8U/RCB7u3w5A6nySBi0EAMBy", 
        "full_name": "Кристијан Карбевски",
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
    {
        "user_id": 1,
        "municipality_id": 1,
        "department": "Општинска администрација",
    }
]



async def seed():
    async with AsyncSessionLocal() as db:
        print("\n🌱 Starting database seed matched with exact SQL row definitions...\n")

        print("📍 Seeding city...")
        existing = await db.execute(select(City).where(City.name == CITY["name"]))
        city = existing.scalar_one_or_none()
        if not city:
            city = City(**CITY)
            db.add(city)
            await db.flush()
            print(f"   ✓ {city.name} (Created)")
        else:
            print(f"   ~ {city.name} (Detected existing row)")

        print("\n🏛️  Seeding municipality...")
        existing = await db.execute(
            select(Municipality).where(Municipality.name == MUNICIPALITY["name"])
        )
        mun = existing.scalar_one_or_none()
        if not mun:
            mun = Municipality(name=MUNICIPALITY["name"], city_id=city.id)
            db.add(mun)
            await db.flush()
            print(f"   ✓ {mun.name} (Created)")
        else:
            print(f"   ~ {mun.name} (Detected existing row)")

        print("\n🏷️  Seeding categories...")
        cat_map: dict[str, Category] = {}
        for c in CATEGORIES:
            existing = await db.execute(
                select(Category).where(Category.name == c["name"])
            )
            cat = existing.scalar_one_or_none()
            if not cat:
                cat = Category(**c)
                db.add(cat)
                await db.flush()
                print(f"   ✓ {cat.name}")
            else:
                print(f"   ~ {cat.name} (already exists)")
            cat_map[cat.name] = cat

        print("\n📧 Seeding email routing for Велес...")
        for r in ROUTING:
            cat = cat_map.get(r["category"])
            if not cat:
                continue
            existing = await db.execute(
                select(MunicipalityCategoryRouting).where(
                    MunicipalityCategoryRouting.municipality_id == mun.id,
                    MunicipalityCategoryRouting.category_id == cat.id,
                )
            )
            if not existing.scalar_one_or_none():
                routing = MunicipalityCategoryRouting(
                    municipality_id=mun.id,
                    category_id=cat.id,
                    routing_email=r["email"],
                    department_name=r["dept"],
                )
                db.add(routing)
                print(f"   ✓ {r['category']} → {r['email']} ({r['dept']})")
            else:
                print(f"   ~ {r['category']} (already exists)")

        print("\n👤 Seeding users...")
        for u in USERS:
            existing_user = await db.execute(
                select(User).where(User.email == u["email"])
            )
            user = existing_user.scalar_one_or_none()
            
            if not user:
                final_password = u.get("password_hash") or hash_password(u["password_raw"])
                user = User(
                    email=u["email"],
                    password=final_password,
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True,
                )
                db.add(user)
                await db.flush()
                print(f"   ✓ User {user.email} (Created)")
            else:
                print(f"   ~ User {user.email} (Detected existing row)")

        print("\n💼 Seeding municipality employees...")
        for emp_data in MUNICIPALITY_EMPLOYEES:
            existing_emp = await db.execute(
                select(MunicipalityEmployee).where(
                    MunicipalityEmployee.user_id == emp_data["user_id"],
                    MunicipalityEmployee.municipality_id == emp_data["municipality_id"]
                )
            )
            emp = existing_emp.scalar_one_or_none()
            
            if not emp:
                employee = MunicipalityEmployee(
                    user_id=emp_data["user_id"],
                    municipality_id=emp_data["municipality_id"],
                    department=emp_data["department"],
                )
                db.add(employee)
                await db.flush()
                print(f"   ✓ Employee relationship inserted: user_id={emp_data['user_id']}, municipality_id={emp_data['municipality_id']}")
            else:
                print(f"   ~ Employee relationship already exists for user_id={emp_data['user_id']}")

        print("\n💾 Committing changes...")
        await db.commit()
        print("✅ Database perfectly synced with manual SQL setup!")


async def main():
    try:
        await seed()
    finally:
        print("🔌 Disposing connection pool...")
        await engine.dispose()
        print("👋 Process complete.")


if __name__ == "__main__":
    asyncio.run(main())