from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.respaldo import descargar_respaldo


urlpatterns = [
    path('', include('api.urls')),

    path(
        'admin/descargar-respaldo/',
        descargar_respaldo,
        name='descargar_respaldo'
    ),

    path('admin/', admin.site.urls),

    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]