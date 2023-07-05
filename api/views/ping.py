from django.utils import timezone
from rest_framework import generics, response
from rest_framework.permissions import IsAuthenticated


class Ping(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def get(self, *args, **kwargs):
        return response.Response({"now": timezone.now()})
