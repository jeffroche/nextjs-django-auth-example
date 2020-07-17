from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import serializers


class Login(TokenObtainPairView):
    serializer_class = serializers.TokenObtainPairSerializer


class RefreshToken(TokenRefreshView):
    pass


class Profile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.User

    def get_object(self):
        return self.request.user
