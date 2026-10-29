FROM python:3.11-slim

WORKDIR /app

# Instalar uv
RUN pip install uv

# Copiar archivos de dependencias
COPY pyproject.toml uv.lock /app/

# Instalar dependencias
RUN uv sync --frozen

# Copiar el proyecto
COPY . /app/

EXPOSE 8000

CMD ["uv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]