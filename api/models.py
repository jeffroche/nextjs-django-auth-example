from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    name = models.CharField("Name of user", blank=True, max_length=255)
