from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Categoria, Etiqueta, Planta, Perfil


class CategoriaTest(TestCase):

    def test_crear_categoria(self):
        categoria = Categoria.objects.create(
            nombre="Huerta",
            descripcion="Artículos sobre huertas urbanas"
        )

        self.assertEqual(categoria.nombre, "Huerta")
        self.assertEqual(Categoria.objects.count(), 1)


class EtiquetaTest(TestCase):

    def test_crear_etiqueta(self):
        etiqueta = Etiqueta.objects.create(
            nombre="Jardinería"
        )

        self.assertEqual(etiqueta.nombre, "Jardinería")
        self.assertEqual(Etiqueta.objects.count(), 1)


class PlantaTest(TestCase):

    def test_crear_planta(self):
        planta = Planta.objects.create(
            nombre_comun="Tomate",
            nombre_cientifico="Solanum lycopersicum",
            necesidad_luz="SOL",
            frecuencia_riego_dias=2
        )

        self.assertEqual(planta.nombre_comun, "Tomate")
        self.assertEqual(planta.frecuencia_riego_dias, 2)


class PerfilTest(TestCase):

    def test_crear_perfil(self):
        usuario = User.objects.create_user(
            username="usuario_prueba",
            password="12345678"
        )

        perfil = Perfil.objects.create(
            user=usuario,
            nivel_experiencia="PRINCIPIANTE",
            ciudad="Río Cuarto"
        )

        self.assertEqual(perfil.user.username, "usuario_prueba")
        self.assertEqual(perfil.ciudad, "Río Cuarto")


class CategoriaAPITest(TestCase):

    def setUp(self):
        self.cliente = APIClient()

        self.categoria = Categoria.objects.create(
            nombre="Huerta",
            descripcion="Artículos sobre huertas urbanas"
        )

    def test_listar_categorias(self):
        respuesta = self.cliente.get("/api/categorias/")

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["count"], 1)
        self.assertEqual(
            respuesta.data["results"][0]["nombre"],
            "Huerta"
        )

    def test_crear_categoria_sin_autenticacion(self):
        respuesta = self.cliente.post(
            "/api/categorias/",
            {
                "nombre": "Nueva categoría",
                "descripcion": "Categoría de prueba"
            },
            format="json"
        )

        self.assertIn(respuesta.status_code, [401, 403])
        self.assertEqual(Categoria.objects.count(), 1)