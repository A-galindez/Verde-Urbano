from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from .views import (
    bienvenida,
    PerfilViewSet, CategoriaViewSet, EtiquetaViewSet,
    ArticuloViewSet, ComentarioViewSet, PlantaViewSet,
    HuertaUsuarioViewSet, ProductoInsumoViewSet,
    TallerEventoViewSet, InscripcionEventoViewSet
)

router = DefaultRouter()
router.register(r'perfiles', PerfilViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'etiquetas', EtiquetaViewSet)
router.register(r'articulos', ArticuloViewSet)
router.register(r'comentarios', ComentarioViewSet)
router.register(r'plantas', PlantaViewSet)
router.register(r'huerta-usuario', HuertaUsuarioViewSet, basename='huerta-usuario')
router.register(r'productos', ProductoInsumoViewSet)
router.register(r'talleres', TallerEventoViewSet)
router.register(r'inscripciones', InscripcionEventoViewSet)

urlpatterns = [
    # Vista principal de bienvenida
    path('', bienvenida, name='bienvenida'),

    # Endpoints de la API
    path('api/', include(router.urls)),

    # Autenticación por Token
    path('api/login/', obtain_auth_token, name='api_token_auth'),

    # Documentación OpenAPI / Swagger / Redoc
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]