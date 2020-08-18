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
        cookie_name = getattr(settings, 'JWT_COOKIE_NAME', "refresh_token")
        cookie_secure = getattr(settings, 'JWT_COOKIE_SECURE', False)
        cookie_samesite = getattr(settings, 'JWT_COOKIE_SAMESITE', "Lax")
        # TODO: this should probably be pulled from the token exp
        expiration = (
            dt.datetime.utcnow() + jwt_settings.REFRESH_TOKEN_LIFETIME
        )

        resp.set_cookie(
            cookie_name,
            serializer.validated_data["refresh"],
            expires=expiration,
            secure=cookie_secure,
            httponly=True,
            samesite=cookie_samesite
        )

        return resp


class Login(TokenViewBaseWithCookie):
    serializer_class = serializers.TokenObtainPairSerializer


class RefreshToken(TokenViewBaseWithCookie):
    serializer_class = serializers.TokenRefreshSerializer


class Logout(APIView):

    def post(self, *args, **kwargs):
        resp = Response({})
        token = self.get_token_from_cookie()
        refresh = RefreshTokenModel(token)
        refresh.blacklist()
        cookie_name = getattr(settings, 'JWT_COOKIE_NAME', "refresh_token")
        resp.delete_cookie(cookie_name)
        return resp

    def get_token_from_cookie(self):
        cookie_name = getattr(settings, 'JWT_COOKIE_NAME', "refresh_token")
        return self.request.COOKIES.get(cookie_name)
