from django.db import models
from django.contrib.auth.models import User

# 1. Perfil de Usuario (Extensión del modelo User)
class Perfil(models.Model):
    NIVELES = [
        ('PRINCIPIANTE', 'Principiante'),
        ('INTERMEDIO', 'Intermedio'),
        ('EXPERTO', 'Experto'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    biografia = models.TextField(blank=True, null=True)
    nivel_experiencia = models.CharField(max_length=20, choices=NIVELES, default='PRINCIPIANTE')
    ciudad = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

# 2. Categoría de Artículos
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# 3. Etiquetas (Tags)
class Etiqueta(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

# 4. Artículo del Blog
class Articulo(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    autor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articulos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, related_name='articulos')
    etiquetas = models.ManyToManyField(Etiqueta, blank=True, related_name='articulos')
    me_gusta = models.PositiveIntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

# 5. Comentarios de Artículos
class Comentario(models.Model):
    articulo = models.ForeignKey(Articulo, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comentarios')
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.autor.username} en {self.articulo.titulo}"

# 6. Catálogo General de Plantas
class Planta(models.Model):
    LUZ_CHOICES = [
        ('SOL', 'Sol Directo'),
        ('MEDIA_SOMBRA', 'Media Sombra'),
        ('SOMBRA', 'Sombra'),
    ]
    nombre_comun = models.CharField(max_length=100)
    nombre_cientifico = models.CharField(max_length=100, blank=True, null=True)
    necesidad_luz = models.CharField(max_length=20, choices=LUZ_CHOICES, default='SOL')
    frecuencia_riego_dias = models.IntegerField(help_text="Días entre cada riego")
    temporada_siembra = models.CharField(max_length=100, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre_comun

# 7. Registros de la Huerta del Usuario
class HuertaUsuario(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mi_huerta')
    planta = models.ForeignKey(Planta, on_delete=models.CASCADE, related_name='en_huertas')
    cantidad = models.PositiveIntegerField(default=1)
    fecha_plantacion = models.DateField()
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.planta.nombre_comun} de {self.usuario.username}"

# 8. Insumos y Productos del Vivero/Tienda
class ProductoInsumo(models.Model):
    CATEGORIAS_PRODUCTO = [
        ('SEMILLAS', 'Semillas'),
        ('HERRAMIENTAS', 'Herramientas'),
        ('SUSTRATO', 'Sustratos y Fertilizantes'),
        ('MACETAS', 'Macetas y Maceteros'),
    ]
    nombre = models.CharField(max_length=150)
    categoria = models.CharField(max_length=30, choices=CATEGORIAS_PRODUCTO)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} (${self.precio})"

# 9. Talleres y Eventos de Capacitación
class TallerEvento(models.Model):
    titulo = models.CharField(max_length=200)
    facilitador = models.CharField(max_length=100)
    fecha_evento = models.DateTimeField()
    cupo_maximo = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    lugar = models.CharField(max_length=200, help_text="Dirección o enlace de reunión virtual")
    descripcion = models.TextField()

    def __str__(self):
        return self.titulo

# 10. Inscripciones a Talleres
class InscripcionEvento(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('CONFIRMADO', 'Confirmado'),
        ('CANCELADO', 'Cancelado'),
    ]
    evento = models.ForeignKey(TallerEvento, on_delete=models.CASCADE, related_name='inscripciones')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscripciones_eventos')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='CONFIRMADO')

    class Meta:
        unique_together = ('evento', 'usuario')

    def __str__(self):
        return f"{self.usuario.username} - {self.evento.titulo}"