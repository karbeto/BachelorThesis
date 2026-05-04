import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def build_report_email(
    report_id: int,
    title: str,
    description: str | None,
    category_name: str,
    address: str | None,
    latitude: float,
    longitude: float,
    citizen_email: str,
) -> str:
    maps_link = (
        f"https://www.google.com/maps?q={latitude},{longitude}"
    )
    description_text = description or "Нема опис"
    address_text = address or "Нема адреса"

    return f"""
Почитувани,

Примена е нова пријава за урбан дефект преку платформата за граѓански активизам.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ДЕТАЛИ ЗА ПРИЈАВАТА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Број на пријава : #{report_id}
Наслов          : {title}
Категорија      : {category_name}
Опис            : {description_text}
Адреса          : {address_text}
Локација        : {maps_link}
Пријавено од    : {citizen_email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ве молиме да го разгледате проблемот и да го ажурирате статусот
на пријавата преку веб-панелот.

Доколку пријавата е веќе решена или не е во ваша надлежност,
ве молиме известете нè за да ја ажурираме соодветно.

Со почит,
Платформа за граѓански активизам
"""


async def send_report_email(
    to_email: str,
    report_id: int,
    title: str,
    description: str | None,
    category_name: str,
    address: str | None,
    latitude: float,
    longitude: float,
    citizen_email: str,
) -> bool:
    
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = (
            f"[Граѓанска пријава #{report_id}] {category_name} — {title}"
        )
        msg["From"] = settings.SMTP_USER
        msg["To"] = to_email

        body = build_report_email(
            report_id=report_id,
            title=title,
            description=description,
            category_name=category_name,
            address=address,
            latitude=latitude,
            longitude=longitude,
            citizen_email=citizen_email,
        )

        msg.attach(MIMEText(body, "plain", "utf-8"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())

        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {to_email}: {e}")
        return False


async def send_status_update_email(
    to_email: str,
    report_id: int,
    title: str,
    new_status: str,
) -> bool:
    status_translations = {
        "submitted": "Поднесено",
        "in_progress": "Се решава",
        "resolved": "Решено",
        "rejected": "Одбиено",
    }
    status_mk = status_translations.get(new_status, new_status)

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = (
            f"[Ажурирање на пријава #{report_id}] Статус: {status_mk}"
        )
        msg["From"] = settings.SMTP_USER
        msg["To"] = to_email

        body = f"""
Почитуван/а,

Статусот на вашата пријава е ажуриран.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Број на пријава : #{report_id}
Наслов          : {title}
Нов статус      : {status_mk}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Можете да го следите напредокот на вашата пријава преку апликацијата.

Со почит,
Платформа за граѓански активизам
"""
        msg.attach(MIMEText(body, "plain", "utf-8"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())

        return True

    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send status email to {to_email}: {e}")
        return False
