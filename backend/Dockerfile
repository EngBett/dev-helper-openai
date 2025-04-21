FROM python:3.13-slim

WORKDIR /app

COPY . .

RUN python -m pip install --upgrade pip && \
    pip install --retries 5 --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]