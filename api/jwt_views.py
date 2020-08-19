import datetime as dt
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import (
    RefreshToken as RefreshTokenModel
)

from . import serializers


class TokenViewBaseWithCookie(TokenViewBase):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        resp = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # TODO: this should probably be pulled from the token exp
        expiration = (
            dt.datetime.utcnow() + jwt_settings.REFRESH_TOKEN_LIFETIME
        )

        resp.set_cookie(
            settings.JWT_COOKIE_NAME,
            serializer.validated_data["refresh"],
            expires=expiration,
            secure=settings.JWT_COOKIE_SECURE,
            httponly=True,
            samesite=settings.JWT_COOKIE_SAMESITE
        )

        return resp


class Login(TokenViewBaseWithCookie):
    serializer_class = serializers.TokenObtainPairSerializer


class RefreshToken(TokenViewBaseWithCookie):
    serializer_class = serializers.TokenRefreshSerializer


class Logout(APIView):

    def post(self, *args, **kwargs):
        resp = Response({})
        token = self.request.COOKIES.get(settings.JWT_COOKIE_NAME)
        refresh = RefreshTokenModel(token)
        refresh.blacklist()
        resp.delete_cookie(settings.JWT_COOKIE_NAME)
        return resp
