FROM python:3.9-slim AS builder
# FROM python:3.8-slim-buster AS builder

WORKDIR /py/app

COPY requirements.txt requirements.txt

RUN pip3 install --upgrade pip

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

# RUN pip3 install uvicorn

COPY ptmodel/gnet555eiei.pt gnet555eiei.pt

COPY fastapisrv/main.py fastapisrv/main.py

# FROM alpine:3.13
# FROM python:3.6-alpline
# WORKDIR /app
# COPY --from=builder /py/app/fastapisrv/main.py fastapisrv/main.py
# COPY --from=builder /py/app/gnet555eiei.pt .

CMD ["uvicorn", "fastapisrv.main:app", "--host", "0.0.0.0", "--port", "1234"]
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "1234"]
# CMD ["python3", "./main.py"]
