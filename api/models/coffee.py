from django.db import models


class AuditHistory(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class Coffee(models.Model):
    name = models.CharField(max_length=255, blank=False)
    brand = models.ForeignKey("Brand", related_name="coffees", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.brand}"


class Brand(models.Model):
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name