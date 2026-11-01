from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Perfil, Categoria, Etiqueta, Articulo,
    Comentario, Planta, HuertaUsuario,
    ProductoInsumo, TallerEvento, InscripcionEvento
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class PerfilSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Perfil
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = '__all__'


class ComentarioSerializer(serializers.ModelSerializer):
    autor = UserSerializer(read_only=True)
    autor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='autor',
        write_only=True
    )

    class Meta:
        model = Comentario
        fields = [
            'id',
            'articulo',
            'autor',
            'autor_id',
            'contenido',
            'fecha_creacion'
        ]


class ArticuloListSerializer(serializers.ModelSerializer):
    autor = UserSerializer(read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    etiquetas = EtiquetaSerializer(many=True, read_only=True)

    class Meta:
        model = Articulo
        fields = '__all__'


class ArticuloWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Articulo
        fields = '__all__'


class PlantaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planta
        fields = '__all__'


class HuertaUsuarioSerializer(serializers.ModelSerializer):
    planta_detalle = PlantaSerializer(
        source='planta',
        read_only=True
    )

    class Meta:
        model = HuertaUsuario
        fields = '__all__'
        read_only_fields = ['usuario']


class ProductoInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoInsumo
        fields = '__all__'


class TallerEventoSerializer(serializers.ModelSerializer):
    inscripciones = serializers.StringRelatedField(
        many=True,
        read_only=True
    )

    class Meta:
        model = TallerEvento
        fields = '__all__'


class InscripcionEventoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = InscripcionEvento
        fields = '__all__'