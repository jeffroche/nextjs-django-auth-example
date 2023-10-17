# from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from . import views
from . import jwt_views
from app import settings



admin.autodiscover()


urlpatterns = [
    path("me/", views.Profile.as_view(), name="me"),
    path("upload_file",views.UploadFile.as_view(),name="upload_file"),
    path("token/", jwt_views.Login.as_view(), name="token"),
    path(
        "token/refresh/", jwt_views.RefreshToken.as_view(),
        name="token-refresh"
    ),
    path("token/logout/", jwt_views.Logout.as_view(), name="logout"),
    path("ping/", views.Ping.as_view(), name="ping"),
    path("admin/", admin.site.urls),
]
print("check here:",settings.DEBUG,settings.STATIC_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

print(urlpatterns,"and",static(settings.STATIC_URL, document_root=settings.STATIC_ROOT))
# Include the static files URL pattern for development
# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
#     print("debug ",urlpatterns)


urlpatterns += [
    path("api-auth/", include('rest_framework.urls'))
] 

if not settings.ON_SERVER:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
