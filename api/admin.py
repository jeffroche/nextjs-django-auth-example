from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from . import models

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    ordering = ("email",)


@admin.register(models.Coffee)
class CoffeeAdmin(admin.ModelAdmin):
    list_display = ("name", "brand")


@admin.register(models.Review)
class ReviewAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Preparation)
class PreparationAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Brand)
class BrandAdmin(admin.ModelAdmin):
    pass
