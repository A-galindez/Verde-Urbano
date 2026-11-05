FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock /app/

RUN uv sync --frozen --no-install-project

COPY . /app/

RUN uv sync --frozen

RUN uv run python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["sh", "-c", "uv run python manage.py migrate --noinput && if [ -n \"$DJANGO_SUPERUSER_USERNAME\" ] && [ -n \"$DJANGO_SUPERUSER_EMAIL\" ] && [ -n \"$DJANGO_SUPERUSER_PASSWORD\" ]; then uv run python manage.py crear_admin || exit 1; fi && exec uv run gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]