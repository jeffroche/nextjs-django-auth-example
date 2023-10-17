from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    name = models.CharField("Name of user", blank=True, max_length=255)


class ExtractedData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.TextField()
    income = models.DecimalField(max_digits=10, decimal_places=2)
    
