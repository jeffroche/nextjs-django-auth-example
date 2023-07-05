from rest_framework import permissions, serializers, viewsets
from rest_framework.response import Response
from api.models import Coffee
from api.views.pagination import APIPaginator
from api.models import Brand


class BrandShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


class CoffeeSerializer(serializers.ModelSerializer):
    is_favorite = serializers.BooleanField(read_only=True)
    brand = BrandShortSerializer(read_only=True)

    class Meta:
        model = Coffee
        fields = ("id", "name", "is_favorite", "brand")


class CoffeeViewSet(viewsets.ModelViewSet):
    model = Coffee
    serializer_class = CoffeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = APIPaginator

    def get_queryset(self):
        qs = Coffee.objects.all()
        qs = qs.annotate_is_favorite(self.request.user)
        return qs

    def list(self, request, *args, **kwargs):
        coffees = self.get_queryset()
        results = self.paginate_queryset(coffees)
        serializer = self.get_serializer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        coffee = self.get_object()
        serializer = self.get_serializer(coffee)
        return Response(serializer.data)
