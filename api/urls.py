from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from rest_framework import routers

from api.views import brands, ping, profile, coffees
from . import jwt_views

admin.autodiscover()

router = routers.DefaultRouter()
router.register(r"brand", brands.BrandViewSet, basename="brand")
router.register(r"coffee", coffees.CoffeeViewSet, basename="coffee")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("me/", profile.Profile.as_view(), name="me"),
    path("login/", jwt_views.Login.as_view(), name="login"),
    path("register/", jwt_views.Register.as_view(), name="register"),
    path("token/refresh/", jwt_views.RefreshTokenView.as_view(), name="token-refresh"),
    path("token/logout/", jwt_views.Logout.as_view(), name="logout"),
    path("ping/", ping.Ping.as_view(), name="ping"),
]

urlpatterns += [path("api-auth/", include("rest_framework.urls"))]

if not settings.ON_SERVER:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
