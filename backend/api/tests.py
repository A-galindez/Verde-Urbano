from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Categoria, Etiqueta, Planta, Perfil, HuertaUsuario


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


class PermisosCategoriaTest(TestCase):

    def setUp(self):
        self.cliente = APIClient()

        self.usuario = User.objects.create_user(
            username="usuario_comun",
            password="ClaveSegura123"
        )

        self.admin = User.objects.create_user(
            username="administrador",
            password="ClaveSegura123",
            is_staff=True
        )

    def test_usuario_comun_no_puede_crear_categoria(self):
        self.cliente.force_authenticate(user=self.usuario)

        respuesta = self.cliente.post(
            "/api/categorias/",
            {
                "nombre": "Categoría no autorizada"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 403)

        self.assertFalse(
            Categoria.objects.filter(
                nombre="Categoría no autorizada"
            ).exists()
        )

    def test_administrador_puede_crear_categoria(self):
        self.cliente.force_authenticate(user=self.admin)

        respuesta = self.cliente.post(
            "/api/categorias/",
            {
                "nombre": "Nueva categoría"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 201)

        self.assertTrue(
            Categoria.objects.filter(
                nombre="Nueva categoría"
            ).exists()
        )


class PermisosPerfilTest(TestCase):

    def setUp(self):
        self.cliente = APIClient()

        self.usuario1 = User.objects.create_user(
            username="usuario1",
            password="ClaveSegura123"
        )

        self.usuario2 = User.objects.create_user(
            username="usuario2",
            password="ClaveSegura123"
        )

    def test_usuario_puede_crear_su_perfil(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.post(
            "/api/perfiles/",
            {
                "ciudad": "Río Cuarto",
                "nivel_experiencia": "PRINCIPIANTE"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 201)

        self.assertTrue(
            Perfil.objects.filter(
                user=self.usuario1
            ).exists()
        )

    def test_usuario_no_puede_crear_dos_perfiles(self):
        Perfil.objects.create(
            user=self.usuario1,
            ciudad="Río Cuarto",
            nivel_experiencia="PRINCIPIANTE"
        )

        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.post(
            "/api/perfiles/",
            {
                "ciudad": "Córdoba",
                "nivel_experiencia": "INTERMEDIO"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)

        self.assertEqual(
            Perfil.objects.filter(
                user=self.usuario1
            ).count(),
            1
        )

    def test_usuario_no_puede_editar_perfil_ajeno(self):
        perfil = Perfil.objects.create(
            user=self.usuario2,
            ciudad="Córdoba",
            nivel_experiencia="PRINCIPIANTE"
        )

        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.patch(
            f"/api/perfiles/{perfil.id}/",
            {
                "ciudad": "Rosario"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 403)

        perfil.refresh_from_db()

        self.assertEqual(
            perfil.ciudad,
            "Córdoba"
        )

    def test_usuario_puede_editar_su_perfil(self):
        perfil = Perfil.objects.create(
            user=self.usuario1,
            ciudad="Córdoba",
            nivel_experiencia="PRINCIPIANTE"
        )

        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.patch(
            f"/api/perfiles/{perfil.id}/",
            {
                "ciudad": "Río Cuarto"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 200)

        perfil.refresh_from_db()

        self.assertEqual(
            perfil.ciudad,
            "Río Cuarto"
        )


class RegistroUsuarioTest(TestCase):

    def setUp(self):
        self.cliente = APIClient()
        self.url = "/api/registro/"

    def test_registro_correcto(self):
        respuesta = self.cliente.post(
            self.url,
            {
                "username": "nuevo_usuario",
                "email": "nuevo@example.com",
                "password": "ClaveSegura2026!"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 201)

        self.assertTrue(
            User.objects.filter(
                username="nuevo_usuario"
            ).exists()
        )

    def test_contrasena_corta(self):
        respuesta = self.cliente.post(
            self.url,
            {
                "username": "usuario_corto",
                "email": "corto@example.com",
                "password": "abc"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("password", respuesta.data)

        self.assertFalse(
            User.objects.filter(
                username="usuario_corto"
            ).exists()
        )

    def test_contrasena_numerica(self):
        respuesta = self.cliente.post(
            self.url,
            {
                "username": "usuario_numerico",
                "email": "numerico@example.com",
                "password": "123456789"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("password", respuesta.data)

        self.assertFalse(
            User.objects.filter(
                username="usuario_numerico"
            ).exists()
        )

    def test_email_invalido(self):
        respuesta = self.cliente.post(
            self.url,
            {
                "username": "usuario_email",
                "email": "correo_incorrecto",
                "password": "ClaveSegura2026!"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("email", respuesta.data)

        self.assertFalse(
            User.objects.filter(
                username="usuario_email"
            ).exists()
        )

    def test_usuario_duplicado(self):
        User.objects.create_user(
            username="usuario_existente",
            email="primero@example.com",
            password="ClaveSegura2026!"
        )

        respuesta = self.cliente.post(
            self.url,
            {
                "username": "usuario_existente",
                "email": "segundo@example.com",
                "password": "ClaveSegura2026!"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("username", respuesta.data)

        self.assertEqual(
            User.objects.filter(
                username="usuario_existente"
            ).count(),
            1
        )

    def test_email_duplicado(self):
        User.objects.create_user(
            username="primer_usuario",
            email="repetido@example.com",
            password="ClaveSegura2026!"
        )

        respuesta = self.cliente.post(
            self.url,
            {
                "username": "segundo_usuario",
                "email": "REPETIDO@example.com",
                "password": "ClaveSegura2026!"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("email", respuesta.data)

        self.assertFalse(
            User.objects.filter(
                username="segundo_usuario"
            ).exists()
        )


class SeguridadHuertaTest(TestCase):

    def setUp(self):
        self.cliente = APIClient()

        self.usuario1 = User.objects.create_user(
            username="usuario_huerta_1",
            password="ClaveSegura123"
        )

        self.usuario2 = User.objects.create_user(
            username="usuario_huerta_2",
            password="ClaveSegura123"
        )

        self.planta = Planta.objects.create(
            nombre_comun="Tomate",
            nombre_cientifico="Solanum lycopersicum",
            necesidad_luz="SOL",
            frecuencia_riego_dias=2
        )

        self.huerta1 = HuertaUsuario.objects.create(
            usuario=self.usuario1,
            planta=self.planta,
            cantidad=3,
            fecha_plantacion="2026-10-01"
        )

        self.huerta2 = HuertaUsuario.objects.create(
            usuario=self.usuario2,
            planta=self.planta,
            cantidad=5,
            fecha_plantacion="2026-10-02"
        )

    def test_usuario_ve_solo_su_huerta(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.get(
            "/api/huerta-usuario/"
        )

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["count"], 1)

        self.assertEqual(
            respuesta.data["results"][0]["id"],
            self.huerta1.id
        )

    def test_usuario_no_puede_ver_huerta_ajena(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.get(
            f"/api/huerta-usuario/{self.huerta2.id}/"
        )

        self.assertEqual(respuesta.status_code, 404)

    def test_usuario_no_puede_modificar_huerta_ajena(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.patch(
            f"/api/huerta-usuario/{self.huerta2.id}/",
            {
                "cantidad": 10
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 404)

        self.huerta2.refresh_from_db()

        self.assertEqual(
            self.huerta2.cantidad,
            5
        )

    def test_usuario_no_puede_eliminar_huerta_ajena(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.delete(
            f"/api/huerta-usuario/{self.huerta2.id}/"
        )

        self.assertEqual(respuesta.status_code, 404)

        self.assertTrue(
            HuertaUsuario.objects.filter(
                id=self.huerta2.id
            ).exists()
        )

    def test_usuario_no_puede_crear_huerta_para_otro(self):
        self.cliente.force_authenticate(user=self.usuario1)

        respuesta = self.cliente.post(
            "/api/huerta-usuario/",
            {
                "usuario": self.usuario2.id,
                "planta": self.planta.id,
                "cantidad": 2,
                "fecha_plantacion": "2026-11-01"
            },
            format="json"
        )

        self.assertEqual(respuesta.status_code, 201)

        nueva_huerta = HuertaUsuario.objects.get(
            id=respuesta.data["id"]
        )

        self.assertEqual(
            nueva_huerta.usuario,
            self.usuario1
        )

        self.assertEqual(
            HuertaUsuario.objects.filter(
                usuario=self.usuario2
            ).count(),
            1
        )