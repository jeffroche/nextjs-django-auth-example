# nextjs-django-boilerplate

A barebones example of a Next.js SPA backed by a Django API.

Includes the following:

Backend:

- Django
- Django REST Framework
- JWT Authentication

Frontend:

- Next.js
- Tailwind

## Getting up and running

### Backend

Create a virtualenv:

```
$ python3 -m venv .venv
$ source .venv/bin/activate
```

Install requirements:

```
$ pip install -r requirements/base.txt
```

Set up DB (sqlite):

```
$ python manage.py makemigrations api
$ python manage.py migrate
```

### Frontend

See `../README.md`

## Running locally

```
$ source .venv/bin/activate
$ python manage.py runserver 4001
```

## Running tests

```
$ python manage.py test
```