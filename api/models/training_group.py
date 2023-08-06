from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=255, unique=True)
    members = models.ManyToManyField("User", related_name="training_groups")
    city = models.ForeignKey(
        "City", default=None, null=True, blank=True, on_delete=models.SET_DEFAULT
    )
    race = models.ForeignKey(
        "Race", default=None, null=True, blank=True, on_delete=models.SET_DEFAULT
    )
    coached_by = models.ForeignKey(
        "User", null=True, blank=True, on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TrainingGroup(Group):
    def __str__(self):
        return f"{self.race.name}: {self.name} Training Group"


class PacingGroup(Group):
    pace_target = models.TimeField()

    def __str__(self):
        return f"{self.race.name} Pacing Group"
