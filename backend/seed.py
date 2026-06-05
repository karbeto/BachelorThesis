"""
Database Seeder for Civic Platform — Veles Pilot
Run: python -m app.seed
"""
import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.city import City
from app.models.municipality import Municipality
from app.models.municipality_employee import MunicipalityEmployee
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.municipality_category_routing import MunicipalityCategoryRouting
from app.core.security import hash_password


# ── Seed Data — Veles Only ───────────────────────────────────────────────────

CITY = {"name": "Veles", "country": "Macedonia"}

MUNICIPALITY = {"name": "Veles"}

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

# Email routing for Veles — one email per category per responsible department
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
        "dept": "ЈП Електродистрибуција",
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
        "password": "Admin123!",
        "full_name": "Супер Администратор",
        "role": UserRole.superadmin,
        "is_employee": False,
        "department": None,
    },
    {
        "email": "admin@veles.gov.mk",
        "password": "Veles123!",
        "full_name": "Администратор Велес",
        "role": UserRole.municipality_admin,
        "is_employee": True,
        "department": "Општинска администрација",
    },
    {
        "email": "graganin@test.mk",
        "password": "Test123!",
        "full_name": "Тест Граѓанин",
        "role": UserRole.citizen,
        "is_employee": False,
        "department": None,
    },
]


# ── Seeder ───────────────────────────────────────────────────────────────────

async def seed():
    async with AsyncSessionLocal() as db:
        print("\n🌱 Starting database seed for Велес pilot...\n")

        # ── City ──
        print("📍 Seeding city...")
        existing = await db.execute(select(City).where(City.name == CITY["name"]))
        city = existing.scalar_one_or_none()
        if not city:
            city = City(**CITY)
            db.add(city)
            await db.flush()
            print(f"   ✓ {city.name}")
        else:
            print(f"   ~ {city.name} (already exists)")
        await db.commit()

        # ── Municipality ──
        print("\n🏛️  Seeding municipality...")
        existing = await db.execute(
            select(Municipality).where(Municipality.name == MUNICIPALITY["name"])
        )
        mun = existing.scalar_one_or_none()
        if not mun:
            mun = Municipality(name=MUNICIPALITY["name"], city_id=city.id)
            db.add(mun)
            await db.flush()
            print(f"   ✓ {mun.name}")
        else:
            print(f"   ~ {mun.name} (already exists)")
        await db.commit()

        # ── Categories ──
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
        await db.commit()

        # ── Email Routing ──
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
        await db.commit()

        # ── Users ──
        print("\n👤 Seeding users...")
        for u in USERS:
            existing = await db.execute(
                select(User).where(User.email == u["email"])
            )
            user = existing.scalar_one_or_none()
            if not user:
                user = User(
                    email=u["email"],
                    password=hash_password(u["password"]),
                    full_name=u["full_name"],
                    role=u["role"],
                    is_active=True,
                )
                db.add(user)
                await db.flush()

                if u["is_employee"]:
                    employee = MunicipalityEmployee(
                        user_id=user.id,
                        municipality_id=mun.id,
                        department=u["department"],
                    )
                    db.add(employee)
                    await db.flush()

                print(f"   ✓ {user.email} ({user.role.value})")
            else:
                print(f"   ~ {u['email']} (already exists)")
        await db.commit()

        # ── Summary ──
        print("\n✅ Seed complete!\n")
        print("=" * 60)
        print("  ВЕЛЕС PILOT — Test Accounts")
        print("=" * 60)
        for u in USERS:
            role_label = {
                UserRole.superadmin: "Супер Админ    ",
                UserRole.municipality_admin: "Општина Админ  ",
                UserRole.citizen: "Граѓанин       ",
            }[u["role"]]
            print(f"  {role_label}  {u['email']:<30}  {u['password']}")
        print("=" * 60)
        print(f"\n  City ID       : 1 (Велес)")
        print(f"  Municipality  : 1 (Општина Велес)")
        print(f"  Categories    : {len(CATEGORIES)}")
        print(f"  Email routes  : {len(ROUTING)}")
        print("=" * 60)
        print()


if __name__ == "__main__":
    asyncio.run(seed())