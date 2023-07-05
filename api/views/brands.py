from rest_framework import permissions, serializers, viewsets
from rest_framework.response import Response
from api.models import Brand
from api.views.coffees import CoffeeSerializer
from api.views.pagination import APIPaginator


class BrandSerializer(serializers.ModelSerializer):
    coffees = CoffeeSerializer(many=True, read_only=True)
    is_favorite = serializers.BooleanField(read_only=True)

    class Meta:
        model = Brand
        fields = ("id", "name", "image", "is_favorite", "coffees")


class BrandViewSet(viewsets.ModelViewSet):
    model = Brand
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = APIPaginator

    def get_queryset(self):
        qs = Brand.objects.all()
        qs = qs.annotate_is_favorite(self.request.user)
        return qs

    def list(self, request, *args, **kwargs):
        brands = self.get_queryset()
        results = self.paginate_queryset(brands)
        serializer = self.get_serializer(results, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        brand = self.get_object()
        serializer = self.get_serializer(brand)
        return Response(serializer.data)
