# Use the official Python image as the base image
FROM python:3.8-slim

# Set environment variables for Django
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies, including poppler-utils
RUN apt-get update && apt-get -y install tesseract-ocr poppler-utils && apt-get clean


RUN mkdir -p /app/images
# Create and set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/
COPY requirements /app/requirements

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your Django project into the container
COPY . /app/

# Expose the port your Django app will run on
EXPOSE 4001

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:4001"]