from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models

from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """

    def create_user(self, email, **kwargs):
        password = kwargs.get("password")
        clerk_id = kwargs.get("clerk_id")
        if clerk_id and not password:
            password = settings.DEFAULT_CLERK_PASSWORD
        if not email:
            raise ValueError(_("Users must have an email address"))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **kwargs):
        """Create and save a SuperUser with the given email and password."""
        kwargs.setdefault("is_staff", True)
        kwargs.setdefault("is_superuser", True)

        if kwargs.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if kwargs.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **kwargs)


class User(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    clerk_id = models.CharField(max_length=255, unique=True, blank=True, null=True)

    home_city = models.ForeignKey(
        "City",
        related_name="city_runners",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
