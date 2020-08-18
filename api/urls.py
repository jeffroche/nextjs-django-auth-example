from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from . import views
from . import jwt_views

admin.autodiscover()


urlpatterns = [
    path("me/", views.Profile.as_view(), name="me"),
    path("token/", jwt_views.Login.as_view(), name="token"),
    path(
        "token/refresh/", jwt_views.RefreshToken.as_view(),
        name="token-refresh"
    ),
    path("token/logout/", jwt_views.Logout.as_view(), name="logout"),
    path("ping/", views.Ping.as_view(), name="ping"),
    path("admin/", admin.site.urls),
]

urlpatterns += [
    path("api-auth/", include('rest_framework.urls'))
]

if not settings.ON_SERVER:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
