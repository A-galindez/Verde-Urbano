from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import render
from django.contrib.auth.models import User
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


def bienvenida(request):
    return render(request, 'api/bienvenida.html')


class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer


class ArticuloViewSet(viewsets.ModelViewSet):
    queryset = Articulo.objects.all().order_by('-fecha_creacion')
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['categoria', 'autor']
    search_fields = ['titulo', 'contenido']
    ordering_fields = ['fecha_creacion', 'me_gusta']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ArticuloListSerializer
        return ArticuloWriteSerializer

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticatedOrReadOnly]
    )
    def like(self, request, pk=None):
        articulo = self.get_object()
        articulo.me_gusta += 1
        articulo.save()

        return Response(
            {
                'status': 'Me gusta registrado',
                'me_gusta': articulo.me_gusta
            },
            status=status.HTTP_200_OK
        )


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer


class PlantaViewSet(viewsets.ModelViewSet):
    queryset = Planta.objects.all()
    serializer_class = PlantaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_comun', 'nombre_cientifico']


class HuertaUsuarioViewSet(viewsets.ModelViewSet):
    queryset = HuertaUsuario.objects.all()
    serializer_class = HuertaUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HuertaUsuario.objects.filter(
            usuario=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def mi_calendario(self, request):
        plantas_usuario = self.get_queryset()
        recordatorios = []

        for huerta in plantas_usuario:
            recordatorios.append({
                'planta': huerta.planta.nombre_comun,
                'frecuencia_dias': huerta.planta.frecuencia_riego_dias,
                'fecha_plantacion': huerta.fecha_plantacion,
                'consejo': (
                    f"Regar cada "
                    f"{huerta.planta.frecuencia_riego_dias} días."
                )
            })

        return Response({
            'calendario': recordatorios
        })


class ProductoInsumoViewSet(viewsets.ModelViewSet):
    queryset = ProductoInsumo.objects.all()
    serializer_class = ProductoInsumoSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]
    filterset_fields = ['categoria']
    search_fields = ['nombre', 'descripcion']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]

        return [permissions.IsAdminUser()]


class TallerEventoViewSet(viewsets.ModelViewSet):
    queryset = TallerEvento.objects.all()
    serializer_class = TallerEventoSerializer


class InscripcionEventoViewSet(viewsets.ModelViewSet):
    queryset = InscripcionEvento.objects.all()
    serializer_class = InscripcionEventoSerializer


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mi_usuario(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def registro_usuario(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {
                'detail': (
                    'Nombre de usuario y contraseña son requeridos.'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {
                'username': [
                    'El nombre de usuario ya está registrado.'
                ]
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if email and User.objects.filter(email=email).exists():
        return Response(
            {
                'email': [
                    'El correo electrónico ya está registrado.'
                ]
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {
            'message': 'Usuario registrado exitosamente.',
            'id': user.id
        },
        status=status.HTTP_201_CREATED
    )