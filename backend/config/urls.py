from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # 1. Redirige la raíz y las rutas de la app (incluyendo bienvenida)
    path('', include('api.urls')),  # <-- Reemplaza 'tu_app' por el nombre exacto de tu carpeta de app (ej: 'api' o 'core')

    # 2. Panel de administración
    path('admin/', admin.site.urls),

    # 3. Autenticación con SimpleJWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]