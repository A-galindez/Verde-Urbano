from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
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
    class Meta:
        model = HuertaUsuario
        fields = '__all__'
        read_only_fields = ['usuario']


class HuertaUsuarioListSerializer(serializers.ModelSerializer):
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
    cupos_disponibles = serializers.SerializerMethodField()

    class Meta:
        model = TallerEvento
        fields = '__all__'

    def get_cupos_disponibles(self, obj):
        ocupados = obj.inscripciones.exclude(
            estado='CANCELADO'
        ).count()

        return max(obj.cupo_maximo - ocupados, 0)

    def validate_cupo_maximo(self, value):
        if value < 1:
            raise serializers.ValidationError(
                'El cupo máximo debe ser mayor a cero.'
            )

        return value

    def validate_fecha_evento(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                'La fecha del taller debe ser futura.'
            )

        return value


class InscripcionEventoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = InscripcionEvento
        fields = '__all__'
        read_only_fields = [
            'usuario',
            'fecha_inscripcion',
            'estado'
        ]

    def validate(self, attrs):
        request = self.context.get('request')
        evento = attrs.get('evento')

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                'Debés iniciar sesión para inscribirte.'
            )

        if not evento:
            return attrs

        if evento.fecha_evento <= timezone.now():
            raise serializers.ValidationError(
                'No podés inscribirte a un taller que ya finalizó.'
            )

        inscripcion_existente = InscripcionEvento.objects.filter(
            evento=evento,
            usuario=request.user
        ).first()

        if inscripcion_existente:
            raise serializers.ValidationError(
                'Ya tenés una inscripción registrada para este taller.'
            )

        inscriptos = InscripcionEvento.objects.filter(
            evento=evento
        ).exclude(
            estado='CANCELADO'
        ).count()

        if inscriptos >= evento.cupo_maximo:
            raise serializers.ValidationError(
                'Este taller ya no tiene cupos disponibles.'
            )

        return attrs