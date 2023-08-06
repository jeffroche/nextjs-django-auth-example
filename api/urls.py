from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from rest_framework import routers
from api.views.races import RaceViewSet
from api.views import ping, profile
from . import jwt_views


admin.autodiscover()

router = routers.DefaultRouter()
router.register(r"races", RaceViewSet, basename="races")

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

if settings.DEBUG_TOOLBAR:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
