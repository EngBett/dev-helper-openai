import os
from openai import OpenAI
from dotenv import load_dotenv

from utils.text_cleaner import clean_text

load_dotenv()
client = OpenAI(
    base_url=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY")
)


async def get_llm_response(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL_NAME"),
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        raw_text = response.choices[0].message.content.strip()
        cleaned = clean_text(raw_text)
        return cleaned
    except Exception as e:
        print("Error calling LLM:", e)
        return "Sorry, something went wrong."