from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework_simplejwt.tokens import RefreshToken

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


class TokenObtainPairSerializer(jwt_serializers.TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims
        token["name"] = user.name

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['refresh_expires'] = refresh["exp"]
        data['access'] = str(refresh.access_token)
        data['access_expires'] = refresh.access_token["exp"]

        return data


class TokenRefreshSerializer(serializers.Serializer):
    # Instead of inputting the refresh token from the HTTP body, we pull it
    # from the cookie

    def get_token_from_cookie(self):
        request = self.context["request"]
        return request.COOKIES.get(settings.JWT_COOKIE_NAME)

    def validate(self, attrs):
        token = self.get_token_from_cookie()
        if token is None:
            raise serializers.ValidationError(
                "No refresh token cookie found"
            )
        refresh = RefreshToken(token)

        data = {
            "access": str(refresh.access_token),
            "access_expires": refresh.access_token["exp"]
        }

        if jwt_settings.BLACKLIST_AFTER_ROTATION:
            try:
                # Attempt to blacklist the given refresh token
                refresh.blacklist()
            except AttributeError:
                # If blacklist app not installed, `blacklist` method will
                # not be present
                pass

        refresh.set_jti()
        refresh.set_exp()

        data['refresh'] = str(refresh)
        data['refresh_expires'] = refresh["exp"]

        return data
