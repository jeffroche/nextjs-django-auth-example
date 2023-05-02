from django.conf import settings
from django.db import models
from api.models import AuditHistory
from django.core.validators import MinValueValidator, MaxValueValidator


class Preparation(models.Model):
    hour = models.CharField(
        max_length=5,
        choices=[(str(i), f"{i}:00") for i in range(24)],
        verbose_name="Hour of the day",
    )
    temperature = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def __str__(self):
        return f"{self.hour} - @ {self.temperature} °C"


class Review(AuditHistory):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="reviews", on_delete=models.CASCADE
    )
    comment = models.TextField()
    coffee = models.ForeignKey(
        "Coffee", related_name="reviews", on_delete=models.CASCADE
    )
    preparation = models.ForeignKey(
        "Preparation", related_name="review_preps", on_delete=models.CASCADE
    )
