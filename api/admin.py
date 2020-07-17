from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from . import models

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    pass
