import json
import base64
import httpx
from app.config import settings

SYSTEM_PROMPT = """
You are an AI assistant for a civic reporting platform in Macedonia.
Your job is to classify urban defect reports into one of the provided categories.
You will receive a description of the problem and optionally an image.
Respond ONLY with a valid JSON object in this exact format:
{
    "category_name": "the exact category name from the list",
    "confidence": 0.95,
    "reasoning": "brief explanation"
}
Do not include any other text outside the JSON object.
"""


async def classify_report(
    description: str,
    category_names: list[str],
    image_base64: str | None = None,
) -> dict:

    categories_str = "\n".join(f"- {name}" for name in category_names)
    user_text = (
        f"Available categories:\n{categories_str}\n\n"
        f"Problem description: {description}\n\n"
        f"Classify this report into one of the categories above."
    )

    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]

    if image_base64:
        messages.append({
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_base64}",
                        "detail": "low",
                    },
                },
                {
                    "type": "text",
                    "text": user_text,
                },
            ],
        })
    else:
        messages.append({
            "role": "user",
            "content": user_text,
        })

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o",
                "messages": messages,
                "max_tokens": 200,
                "temperature": 0.1,
            },
        )
        response.raise_for_status()

    data = response.json()
    raw_text = data["choices"][0]["message"]["content"].strip()

    try:
        result = json.loads(raw_text)
    except json.JSONDecodeError:
        return {
            "category_name": category_names[0],
            "confidence": 0.0,
            "reasoning": "AI response could not be parsed, defaulted to first category",
        }

    if result.get("category_name") not in category_names:
        return {
            "category_name": category_names[0],
            "confidence": 0.0,
            "reasoning": "AI returned unknown category, defaulted to first category",
        }

    return result


def encode_image_to_base64(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes).decode("utf-8")