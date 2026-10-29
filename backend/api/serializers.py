from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Perfil, Categoria, Etiqueta, Articulo, 
    Comentario, Planta, HuertaUsuario, 
    ProductoInsumo, TallerEvento, InscripcionEvento
)

# 1. Serializer básico de Usuario
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

# 2. Perfil
class PerfilSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Perfil
        fields = '__all__'

# 3. Categoria
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# 4. Etiqueta
class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = '__all__'

# 5. Comentario
class ComentarioSerializer(serializers.ModelSerializer):
    autor = UserSerializer(read_only=True)
    autor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='autor', write_only=True
    )

    class Meta:
        model = Comentario
        fields = ['id', 'articulo', 'autor', 'autor_id', 'contenido', 'fecha_creacion']

# 6. Articulo (Cumple REQUISITO: NestedSerializer para GET list)
class ArticuloListSerializer(serializers.ModelSerializer):
    """ Muestra información anidada completa del Autor y Categoría en lecturas """
    autor = UserSerializer(read_only=True)
    categoria = CategoriaSerializer(read_only=True)
    etiquetas = EtiquetaSerializer(many=True, read_only=True)

    class Meta:
        model = Articulo
        fields = '__all__'

class ArticuloWriteSerializer(serializers.ModelSerializer):
    """ Para crear y editar usando IDs directamente """
    class Meta:
        model = Articulo
        fields = '__all__'

# 7. Planta
class PlantaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planta
        fields = '__all__'

# 8. HuertaUsuario
class HuertaUsuarioSerializer(serializers.ModelSerializer):
    planta_detalle = PlantaSerializer(source='planta', read_only=True)

    class Meta:
        model = HuertaUsuario
        fields = '__all__'

# 9. ProductoInsumo
class ProductoInsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoInsumo
        fields = '__all__'

# 10. TallerEvento (Cumple REQUISITO: NestedSerializer para GET list)
class TallerEventoSerializer(serializers.ModelSerializer):
    inscripciones = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = TallerEvento
        fields = '__all__'

# 11. InscripcionEvento
class InscripcionEventoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = InscripcionEvento
        fields = '__all__'