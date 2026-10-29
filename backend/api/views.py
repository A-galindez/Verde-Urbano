from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Perfil, Categoria, Etiqueta, Articulo, 
    Comentario, Planta, HuertaUsuario, 
    ProductoInsumo, TallerEvento, InscripcionEvento
)
from .serializers import (
    PerfilSerializer, CategoriaSerializer, EtiquetaSerializer,
    ArticuloListSerializer, ArticuloWriteSerializer, ComentarioSerializer,
    PlantaSerializer, HuertaUsuarioSerializer, ProductoInsumoSerializer,
    TallerEventoSerializer, InscripcionEventoSerializer
)

# Vista de Bienvenida HTML (Cumple requisito de Vistas)
def bienvenida(request):
    return render(request, 'api/bienvenida.html')

# 1. Perfil ViewSet
class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# 2. Categoria ViewSet
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# 3. Etiqueta ViewSet
class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer

# 4. Articulo ViewSet (Con NestedSerializer + Filtro/Búsqueda + @action)
class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all().order_by('-fecha_creacion')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'autor']
    search_fields = ['titulo', 'contenido']
    ordering_fields = ['fecha_creacion', 'me_gusta']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ArticuloListSerializer
        return ArticuloWriteSerializer

    # ACCIÓN PERSONALIZADA 1: Dar "Me Gusta"
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        articulo = self.get_object()
        articulo.me_gusta += 1
        articulo.save()
        return Response({'status': 'Me gusta registrado', 'me_gusta': articulo.me_gusta}, status=status.HTTP_200_OK)

# 5. Comentario ViewSet
class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer

# 6. Planta ViewSet
class PlantaViewSet(viewsets.ModelViewSet):
    queryset = Planta.objects.all()
    serializer_class = PlantaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_comun', 'nombre_cientifico']

# 7. HuertaUsuario ViewSet (Con @action personalizada)
class HuertaUsuarioViewSet(viewsets.ModelViewSet):
    queryset = HuertaUsuario.objects.all()
    serializer_class = HuertaUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Cada usuario ve solo sus plantas grabadas
        if self.request.user.is_authenticated:
            return HuertaUsuario.objects.filter(usuario=self.request.user)
        return HuertaUsuario.objects.none()

    # ACCIÓN PERSONALIZADA 2: Calendario de Riego del usuario
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mi_calendario(self, request):
        plantas_usuario = self.get_queryset()
        recordatorios = []
        for huerta in plantas_usuario:
            recordatorios.append({
                'planta': huerta.planta.nombre_comun,
                'frecuencia_dias': huerta.planta.frecuencia_riego_dias,
                'fecha_plantacion': huerta.fecha_plantacion,
                'consejo': f"Regar cada {huerta.planta.frecuencia_riego_dias} días."
            })
        return Response({'calendario': recordatorios})

# 8. ProductoInsumo ViewSet
class ProductoInsumoViewSet(viewsets.ModelViewSet):
    queryset = ProductoInsumo.objects.all()
    serializer_class = ProductoInsumoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['categoria']
    search_fields = ['nombre', 'descripcion']

# 9. TallerEvento ViewSet
class TallerEventoViewSet(viewsets.ModelViewSet):
    queryset = TallerEvento.objects.all()
    serializer_class = TallerEventoSerializer

# 10. InscripcionEvento ViewSet
class InscripcionEventoViewSet(viewsets.ModelViewSet):
    queryset = InscripcionEvento.objects.all()
    serializer_class = InscripcionEventoSerializer