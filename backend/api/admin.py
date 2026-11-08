from django.contrib import admin
from .models import (
    Perfil, Categoria, Etiqueta, Articulo,
    Comentario, Planta, HuertaUsuario,
    ProductoInsumo, TallerEvento, InscripcionEvento
)


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ('user', 'nivel_experiencia', 'ciudad')
    list_filter = ('nivel_experiencia',)
    search_fields = ('user__username', 'ciudad')


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)


@admin.register(Etiqueta)
class EtiquetaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)


@admin.register(Articulo)
class ArticuloAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'categoria', 'me_gusta', 'fecha_creacion')
    list_filter = ('categoria', 'fecha_creacion')
    search_fields = ('titulo', 'contenido')
    ordering = ('-fecha_creacion',)


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'articulo', 'autor', 'contenido', 'fecha_creacion')
    list_filter = ('fecha_creacion', 'autor')
    search_fields = ('contenido', 'autor__username')

    def has_add_permission(self, request):
        return False

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ('articulo', 'autor', 'contenido', 'fecha_creacion')
        return []


@admin.register(Planta)
class PlantaAdmin(admin.ModelAdmin):
    list_display = (
        'nombre_comun',
        'nombre_cientifico',
        'necesidad_luz',
        'frecuencia_riego_dias'
    )
    list_filter = ('necesidad_luz',)
    search_fields = ('nombre_comun', 'nombre_cientifico')


@admin.register(HuertaUsuario)
class HuertaUsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'planta', 'cantidad', 'fecha_plantacion')
    list_filter = ('fecha_plantacion',)


@admin.register(ProductoInsumo)
class ProductoInsumoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria', 'precio', 'stock')
    list_filter = ('categoria',)
    search_fields = ('nombre',)


@admin.register(TallerEvento)
class TallerEventoAdmin(admin.ModelAdmin):
    list_display = (
        'titulo',
        'facilitador',
        'fecha_evento',
        'cupo_maximo',
        'precio'
    )
    list_filter = ('fecha_evento',)
    search_fields = ('titulo', 'facilitador')


@admin.register(InscripcionEvento)
class InscripcionEventoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'evento', 'estado', 'fecha_inscripcion')
    list_filter = ('estado',)