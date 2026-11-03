# Verde-Urbano — Backend
INTEGRANTES : Tallone Eliana , Giordano Lucila , Agostini Lucia , Galíndez Abril

## Descripción del proyecto

Verde-Urbano es una aplicación web orientada a la jardinería y las huertas urbanas. Su objetivo es brindar un espacio donde los usuarios puedan compartir conocimientos, consultar información sobre plantas, organizar sus huertas y conocer talleres relacionados con el cuidado del medioambiente.

El backend está desarrollado con Django y Django REST Framework. Proporciona una API REST que permite gestionar usuarios, artículos, comentarios, plantas, huertas personales, productos, talleres e inscripciones.

## Tecnologías utilizadas

- Python 3.12
- Django 6.1.2
- Django REST Framework
- SQLite
- JWT (Simple JWT)
- Django Filter
- drf-spectacular
- django-cors-headers
- uv
- Docker

## Estructura del backend

El proyecto está organizado principalmente en las siguientes carpetas:

- `api/`: contiene los modelos, serializers, vistas, rutas y configuración del administrador.
- `config/`: contiene la configuración principal de Django.
- `core/`: aplicación adicional del proyecto.
- `manage.py`: permite ejecutar los comandos de Django.
- `pyproject.toml`: define las dependencias.
- `uv.lock`: registra las versiones de las dependencias.
- `Dockerfile`: permite construir la imagen Docker.
- `Docker-compose.yml`: contiene la configuración para ejecutar el backend con Docker Compose.

## Planificación de la base de datos

La base de datos fue diseñada para organizar las distintas funcionalidades de Verde-Urbano.

Se utilizaron 10 modelos propios, además del modelo `User` que proporciona Django.

### Modelos

**1. Perfil**

Amplía la información de los usuarios registrados.

Campos principales: usuario, biografía, nivel de experiencia y ciudad.

Relación: uno a uno con `User`.

**2. Categoria**

Permite clasificar los artículos publicados en el blog.

Campos: nombre y descripción.

Relación: una categoría puede tener varios artículos.

**3. Etiqueta**

Permite identificar los temas relacionados con cada artículo.

Campo: nombre.

Relación: muchos a muchos con `Articulo`.

**4. Articulo**

Almacena las publicaciones realizadas por los usuarios.

Campos: título, contenido, autor, categoría, etiquetas, cantidad de «me gusta», fecha de creación y fecha de actualización.

Relaciones: pertenece a un usuario, puede tener una categoría y varias etiquetas.

**5. Comentario**

Permite registrar comentarios en los artículos.

Campos: artículo, autor, contenido y fecha de creación.

Relaciones: pertenece a un artículo y a un usuario.

**6. Planta**

Contiene información sobre diferentes especies de plantas.

Campos: nombre común, nombre científico, necesidad de luz, frecuencia de riego, temporada de siembra y descripción.

Relación: una planta puede aparecer en varias huertas de usuarios.

**7. HuertaUsuario**

Permite que cada usuario registre las plantas que tiene en su huerta.

Campos: usuario, planta, cantidad, fecha de plantación y notas.

Relaciones: pertenece a un usuario y a una planta.

**8. ProductoInsumo**

Permite administrar un catálogo de productos relacionados con jardinería.

Campos: nombre, categoría, precio, stock y descripción.

**9. TallerEvento**

Registra talleres y actividades de capacitación.

Campos: título, facilitador, fecha del evento, cupo máximo, precio, lugar y descripción.

Relación: un taller puede tener varias inscripciones.

**10. InscripcionEvento**

Registra la participación de usuarios en talleres.

Campos: evento, usuario, fecha de inscripción y estado.

Relaciones: pertenece a un usuario y a un taller.

El sistema evita que un mismo usuario tenga dos inscripciones para el mismo evento mediante una restricción de unicidad.

## Relaciones principales

- `User` → `Perfil`: uno a uno.
- `User` → `Articulo`: uno a muchos.
- `Categoria` → `Articulo`: uno a muchos.
- `Articulo` ↔ `Etiqueta`: muchos a muchos.
- `Articulo` → `Comentario`: uno a muchos.
- `User` → `Comentario`: uno a muchos.
- `User` → `HuertaUsuario`: uno a muchos.
- `Planta` → `HuertaUsuario`: uno a muchos.
- `TallerEvento` → `InscripcionEvento`: uno a muchos.
- `User` → `InscripcionEvento`: uno a muchos.

## API REST

Se implementaron 10 ViewSets utilizando `ModelViewSet` de Django REST Framework.

Los ViewSets permiten realizar las operaciones CRUD correspondientes a cada modelo.

Los recursos disponibles son:

- Perfiles
- Categorías
- Etiquetas
- Artículos
- Comentarios
- Plantas
- Huertas de usuarios
- Productos e insumos
- Talleres y eventos
- Inscripciones

Las rutas se encuentran registradas mediante routers de Django REST Framework.

## Serializers

Se utilizaron serializers para transformar los datos de los modelos a JSON y validar la información recibida.

En `ArticuloViewSet` y `HuertaUsuarioViewSet` se configuraron serializers anidados para la operación `list`.

Esto permite mostrar información relacionada al consultar los listados, mientras que las demás operaciones utilizan serializers sin esas relaciones anidadas.

## Funcionalidades adicionales

### Me gusta en artículos

Se implementó una acción personalizada llamada `like` que permite incrementar la cantidad de «me gusta» de un artículo.

### Calendario de huerta

Se implementó una acción personalizada llamada `mi_calendario`.

Esta funcionalidad permite consultar las plantas registradas por el usuario, su frecuencia de riego, fecha de plantación y una recomendación de cuidado.

### Inscripción a talleres

El sistema incluye validaciones para evitar inscripciones duplicadas, inscripciones a talleres que ya finalizaron y nuevas inscripciones cuando no quedan cupos disponibles.

## Autenticación y permisos

El backend utiliza autenticación JWT y autenticación mediante sesiones.

También cuenta con registro de usuarios.

Los permisos permiten consultar públicamente determinados recursos y requieren autenticación para realizar operaciones de escritura.

Algunas funcionalidades, como la administración de productos y talleres, requieren permisos de administrador.

Las huertas personales y las inscripciones utilizan restricciones asociadas al usuario autenticado.

## Filtros, búsquedas y paginación

La API incorpora:

- Búsqueda de artículos por título y contenido.
- Filtros de artículos por categoría y autor.
- Ordenamiento de artículos.
- Búsqueda de plantas por nombre común y científico.
- Búsqueda y filtrado de productos.
- Búsqueda de talleres.
- Paginación de 10 registros por página.

## Instalación del proyecto

### Requisitos

- Python 3.12 o superior.
- uv.
- Git.

### Descargar el repositorio

Clonar el repositorio del proyecto y acceder a la carpeta `backend`.

### Instalar dependencias

```bash
uv sync
```

### Aplicar migraciones

```bash
uv run python manage.py migrate
```

### Crear un superusuario

```bash
uv run python manage.py createsuperuser
```

### Ejecutar el servidor

```bash
uv run python manage.py runserver
```

El servidor estará disponible en el puerto 8000.

## Ejecución con Docker

El backend también puede ejecutarse utilizando Docker.

Desde la carpeta `backend`, construir la imagen:

```bash
sudo docker build -t verde-urbano-backend .
```

Ejecutar el contenedor:

```bash
sudo docker run --rm -p 8000:8000 verde-urbano-backend
```

El servidor quedará disponible en el puerto 8000.

## Documentación de la API

La documentación interactiva está disponible mediante Swagger y ReDoc.

- Swagger: `/api/docs/`
- ReDoc: `/api/redoc/`
- API navegable: `/api/`

Estas herramientas permiten consultar los endpoints, los métodos HTTP y las estructuras de los datos.

## Panel de administración

El proyecto utiliza el panel de administración de Django para gestionar los modelos.

Para acceder, se debe iniciar sesión con una cuenta que tenga permisos de administración.


## Evidencias de funcionamiento
En esta sección se presentan las evidencias de funcionamiento del proyecto, incluyendo la ejecución del servidor, el panel de administración, la documentación de la API, sus endpoints y la ejecución mediante Docker.

- Ejecución del servidor Django.
- <img width="825" height="578" alt="Captura desde 2026-11-02 19-02-33" src="https://github.com/user-attachments/assets/4b0c591f-8f09-42a8-8b04-8d7eb901abfb" />

- Panel de administración.
- <img width="1843" height="1003" alt="Captura desde 2026-11-02 19-13-42" src="https://github.com/user-attachments/assets/d23e552f-e33e-4994-8b51-02aa437a2b8e" />

- Documentación Swagger.
- <img width="1843" height="1003" alt="Captura desde 2026-11-02 19-15-25" src="https://github.com/user-attachments/assets/9470bd81-d3f3-4ad9-b236-c8b2a739b56a" />

- API navegable.
- <img width="1843" height="1003" alt="Captura desde 2026-11-02 19-16-57" src="https://github.com/user-attachments/assets/3489caf0-e9cd-47ef-8ab8-a8030b8609a0" />

- Ejemplos de endpoints.
- <img width="1843" height="1003" alt="Captura desde 2026-11-02 19-18-13" src="https://github.com/user-attachments/assets/2333792e-78ff-4a2c-9b6e-029b46d77d01" />
<img width="1843" height="1003" alt="Captura desde 2026-11-02 19-19-04" src="https://github.com/user-attachments/assets/fab0e23d-531b-4dd3-b905-7fd29c6b3b96" />

- Ejecución del backend con Docker.
  <img width="1920" height="1080" alt="Captura desde 2026-11-02 19-37-12" src="https://github.com/user-attachments/assets/1b69866e-a70b-4716-baa0-85c44ac2c4af" />


---

# **Verde-Urbano — Frontend**

## **Tecnologías utilizadas**

El frontend de Verde-Urbano fue desarrollado utilizando las siguientes tecnologías:

- **Next.js:** framework utilizado para el desarrollo de la aplicación web.
- **React:** biblioteca utilizada para construir los componentes de la interfaz.
- **TypeScript:** lenguaje utilizado para desarrollar las funcionalidades.
- **Tailwind CSS:** herramienta utilizada para el diseño y los estilos.
- **Lucide React:** biblioteca de íconos.
- **Vitest:** herramienta utilizada para realizar pruebas automatizadas.

---

## **Funcionalidades implementadas**

### **Inicio**

Es la página principal de Verde-Urbano. Desde ella, los usuarios pueden acceder a las diferentes secciones de la aplicación.

### **Blog**

Permite visualizar publicaciones relacionadas con la jardinería y las huertas urbanas.

También cuenta con un formulario para crear nuevas publicaciones y compartir información con otros usuarios.

### **Mi Huerta**

Esta sección permite que los usuarios organicen las plantas de su huerta personal.

Entre sus funcionalidades se encuentran:

- Visualizar las plantas registradas.
- Agregar nuevas plantas a la huerta.
- Editar y eliminar plantas registradas.
- Consultar un calendario de riego.
- Acceder a información sobre los cuidados de cada planta.

### **Insumos**

Permite consultar y registrar productos relacionados con la jardinería y el mantenimiento de las huertas.

Sus principales funcionalidades son:

- Visualizar los insumos disponibles.
- Buscar productos por nombre o descripción.
- Filtrar productos por categoría.
- Consultar el precio y el stock disponible.
- Agregar nuevos insumos.
- Editar y eliminar productos registrados.

### **Talleres**

Esta sección permite consultar y gestionar talleres y eventos relacionados con la jardinería.

Sus funcionalidades incluyen:

- Visualizar los talleres disponibles.
- Buscar talleres por nombre, profesor, lugar o descripción.
- Consultar fechas, horarios, precios y cupos disponibles.
- Crear nuevos talleres.
- Editar y eliminar talleres registrados.
- Acceder a la opción de inscripción a talleres.

### **Inicio de sesión y registro**

La aplicación cuenta con formularios que permiten a los usuarios iniciar sesión y registrarse.

Estas funcionalidades se conectan con el sistema de autenticación del backend.

---

## **Instalación y ejecución del frontend**

Para ejecutar el frontend es necesario tener instalados Node.js y npm.

### **1. Ingresar a la carpeta del frontend**

Desde la carpeta principal del proyecto:

```bash
cd frontend
```

### **2. Instalar las dependencias**

```bash
npm install
```

### **3. Iniciar el servidor**

```bash
npm run dev
```

La aplicación se puede visualizar desde el navegador en:

`http://localhost:3000`

---

## **Conexión con el backend**

El frontend se comunica con la API REST desarrollada con Django REST Framework.

La configuración de conexión se encuentra en el archivo:

`frontend/src/lib/api.ts`

La dirección utilizada para el desarrollo es:

`http://127.0.0.1:8000/api`

La conexión permite obtener y enviar información relacionada con las plantas, publicaciones, insumos, talleres y usuarios.

### **Variables de entorno**

La dirección de la API se encuentra configurada directamente en el archivo `frontend/src/lib/api.ts`.

No es necesario crear un archivo `.env` para utilizar la configuración de desarrollo existente.

---

## **Pruebas automatizadas**

Se implementaron pruebas automatizadas utilizando **Vitest** para verificar el funcionamiento de las solicitudes realizadas a la API.

Las pruebas comprueban:

- La obtención correcta del listado de plantas desde la API.
- El manejo de errores cuando una solicitud falla.

### **Ejecución de las pruebas**

Desde la carpeta del frontend:

```bash
npm run test
```

### **Resultados obtenidos**

Se ejecutaron **2 pruebas automatizadas**, ambas con resultados satisfactorios.

- **Pruebas ejecutadas:** 2.
- **Pruebas aprobadas:** 2.
- **Errores:** 0.

### **Verificación de compilación**

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

La compilación del frontend finalizó correctamente.

---

## **Capturas del frontend**

A continuación se muestran las principales pantallas y funcionalidades implementadas en Verde-Urbano.

### **1. Página de inicio**
<img width="1854" height="1048" alt="inicio" src="https://github.com/user-attachments/assets/e15a631f-4cbb-4f9b-9f5a-f348a9740d41" />


### **2. Blog - Listado de publicaciones**

<img width="1854" height="1048" alt="1 blog" src="https://github.com/user-attachments/assets/ee06b17e-59e5-4a76-942a-c1978b85bd02" />


### **3. Blog - Crear publicación**
<img width="1854" height="1048" alt="2 blog" src="https://github.com/user-attachments/assets/7ac0de29-2f5a-4650-b7f9-8ca63a861c4e" />


### **4. Mi Huerta - Plantas registradas y calendario de riego**

<img width="1854" height="1048" alt="1 huerta" src="https://github.com/user-attachments/assets/ca774e44-4843-48cf-8a1b-ff9c05eb9164" />


### **5. Mi Huerta - Agregar planta**
<img width="1854" height="1048" alt="2 huerta" src="https://github.com/user-attachments/assets/87302ef5-d15f-460a-bee9-24ff3c26f7ff" />


### **6. Insumos - Listado de productos**

<img width="1854" height="1048" alt="1 insumos" src="https://github.com/user-attachments/assets/e675b193-6b5b-4eb3-b820-9b0fe733cd82" />


### **7. Insumos - Agregar producto**

<img width="1854" height="1048" alt="2 insumos" src="https://github.com/user-attachments/assets/7228608c-cd2c-4601-8d95-08d1674e77bb" />


### **8. Talleres - Listado de talleres**

<img width="1854" height="1048" alt="1 talleres" src="https://github.com/user-attachments/assets/68fbb286-1560-434c-8823-73f4c361ce31" />


### **9. Talleres - Crear taller**
<img width="1854" height="1048" alt="2 talleres" src="https://github.com/user-attachments/assets/0a3a63bf-2e55-4d81-b3b0-af60dc30890a" />


### **10. Talleres - Taller registrado**

<img width="1854" height="1048" alt="editar y eliminar los talleres" src="https://github.com/user-attachments/assets/a775094f-85de-492e-9968-ec4ca27c421e" />


### **11. Inicio de sesión**

<img width="1854" height="1048" alt="login inicio" src="https://github.com/user-attachments/assets/cedf5078-b3db-4f95-af86-982fa01cf3a5" />


### **12. Registro de usuario**
<img width="1854" height="1048" alt="login registro" src="https://github.com/user-attachments/assets/06d87393-6923-4216-a6ef-d50b942f201b" />


### **13. Pruebas automatizadas del frontend**

<img width="866" height="651" alt="test aprobado" src="https://github.com/user-attachments/assets/eb05579b-a65a-44ef-a9d8-3b673a7d7134" />


## Proyecto académico

Trabajo desarrollado para la materia Ingeniería de Software.

Proyecto: Verde-Urbano.
