from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from . import serializers


class Profile(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.User

    def get_object(self):
        return self.request.user
