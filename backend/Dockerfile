# Use the official Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /code

# Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the backend code
COPY ./app /code/app

# Command to run the Fastapi application using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
