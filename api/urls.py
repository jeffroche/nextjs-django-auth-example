from django.conf import settings
from django.contrib import admin
from django.urls import include, path

from . import views

admin.autodiscover()


urlpatterns = [
    path("me/", views.Profile.as_view(), name="me"),
    path("token/", views.Login.as_view(), name="token"),
    path("token/refresh/", views.RefreshToken.as_view(), name="token-refresh"),
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
