from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from api.models import User


class User(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "clerk_id",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "date_joined",
            "last_login",
        )


class Profile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = User

    def get_object(self):
        return self.request.user
