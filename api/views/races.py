from rest_framework import permissions, serializers, viewsets
from rest_framework.response import Response
from api.models import Race
from api.views.pagination import APIPaginator


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ("id", "name", "race_start", "city")


class RaceViewSet(viewsets.ModelViewSet):
    model = Race
    serializer_class = RaceSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = APIPaginator

    def get_queryset(self):
        qs = Race.objects.all()
        return qs

    def list(self, request, *args, **kwargs):
        races = self.get_queryset()
        results = self.paginate_queryset(races)
        serializer = self.get_serializer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        race = self.get_object()
        serializer = self.get_serializer(race)
        return Response(serializer.data)
