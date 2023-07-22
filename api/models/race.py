from django.db import models


class Race(models.Model):
    UNIT_CHOICES = (
        ("km", "Kilometers"),
        ("mi", "Miles"),
    )

    name = models.CharField(max_length=255, default=None)
    distance = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    distance_unit = models.CharField(max_length=2, choices=UNIT_CHOICES, default="km")
    description = models.TextField(null=True, blank=True, default=None)
    registration_open = models.BooleanField(default=True)
    registration_deadline = models.DateTimeField(default=None)
    participants = models.ManyToManyField(
        "User", through="RaceRegistration", related_name="races_participated"
    )
    race_start = models.DateTimeField()
    city = models.ForeignKey("City", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name

    def get_distance_display(self):
        if self.distance_unit == "km":
            return f"{self.distance} kilometers"
        elif self.distance_unit == "mi":
            return f"{self.distance} miles"
        else:
            return f"{self.distance} {self.distance_unit}"  # Fallback if unit is not recognized
