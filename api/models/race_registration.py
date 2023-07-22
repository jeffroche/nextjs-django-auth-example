from django.db import models
from api.models import User, Race


class RaceRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    registration_date = models.DateTimeField(auto_now_add=True)
    # Add any other fields related to registration details, such as payment status, bib number, etc.
