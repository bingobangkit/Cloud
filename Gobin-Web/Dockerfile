FROM python:3.7

# port number
EXPOSE 8080

# environment
RUN pip install -U pip
COPY requirements.txt app/requirements.txt
RUN pip install -r app/requirements.txt

# app dir
COPY . /app
WORKDIR app

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8080", "--server.address=0.0.0.0"]
