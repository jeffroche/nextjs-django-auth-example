from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from . import models

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "first_name",
                    "last_name",
                    "password",
                    "email",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        # Add more fields if necessary
    )
    ordering = ("email",)


@admin.register(models.TrainingGroup)
class TrainingGroupAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Race)
class RaceAdmin(admin.ModelAdmin):
    pass


@admin.register(models.City)
class CityAdmin(admin.ModelAdmin):
    pass
