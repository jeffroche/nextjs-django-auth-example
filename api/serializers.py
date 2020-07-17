from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer as TokenObtainPairSerializerBase,
)

from . import models


class User(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = (
            "id",
            "username",
            "name",
            "email",
            "is_active",
            "date_joined",
            "last_login",
        )


class TokenObtainPairSerializer(TokenObtainPairSerializerBase):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims
        token["name"] = user.name

        return token
