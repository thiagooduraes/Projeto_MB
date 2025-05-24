FROM python:3.9-slim-buster
WORKDIR /app
ENV PYTHONUNBUFFERED=1

#Atulaliza SO para evitar erro ao instalar pacote do mysql
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Comando para iniciar o servidor Django
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]