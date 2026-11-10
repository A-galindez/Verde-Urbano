# Verde-Urbano — Frontend

## Índice

- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
  - [Inicio](#inicio)
  - [Blog](#blog)
  - [Mi Huerta](#mi-huerta)
  - [Insumos](#insumos)
  - [Talleres](#talleres)
  - [Inicio de sesión y registro](#inicio-de-sesión-y-registro)
- [Autenticación y permisos](#autenticación-y-permisos)
- [Instalación y ejecución del frontend](#instalación-y-ejecución-del-frontend)
- [Conexión con el backend](#conexión-con-el-backend)
- [Variables de entorno](#variables-de-entorno)
- [Pruebas automatizadas](#pruebas-automatizadas)
- [Despliegue en producción](#despliegue-en-producción)
- [Evidencias de funcionamiento](#evidencias-de-funcionamiento)
- [Estado del proyecto](#estado-del-proyecto)
- [Proyecto académico](#proyecto-académico)

---

## Descripción del proyecto

Verde-Urbano es una aplicación web orientada a la jardinería y las huertas urbanas.

Su objetivo es ofrecer un espacio donde los usuarios puedan compartir experiencias, consultar información sobre plantas, organizar sus huertas personales y conocer productos y talleres relacionados con la jardinería.

El frontend está desarrollado con Next.js, React y TypeScript. Se conecta con una API REST creada con Django REST Framework.

La aplicación cuenta con una interfaz responsive y diferentes secciones para facilitar la navegación.

## Tecnologías utilizadas

El frontend de Verde-Urbano fue desarrollado utilizando las siguientes tecnologías:

- **Next.js 16:** framework utilizado para desarrollar la aplicación web.
- **React:** biblioteca utilizada para construir los componentes de la interfaz.
- **TypeScript:** lenguaje utilizado para desarrollar las funcionalidades.
- **Tailwind CSS:** herramienta utilizada para el diseño y los estilos.
- **Lucide React:** biblioteca de íconos.
- **React Hook Form:** biblioteca utilizada para gestionar los formularios.
- **Zod:** herramienta utilizada para validar los datos ingresados.
- **Vitest:** herramienta utilizada para realizar pruebas automatizadas.
- **npm:** gestor de paquetes utilizado para instalar dependencias y ejecutar el proyecto.
- **Vercel:** plataforma utilizada para publicar el frontend.

---

## Funcionalidades implementadas

### Inicio

Es la página principal de Verde-Urbano. Desde ella, los usuarios pueden acceder a las diferentes secciones de la aplicación.

### Blog

Permite visualizar publicaciones relacionadas con la jardinería y las huertas urbanas.

Sus principales funcionalidades son:

- Visualizar publicaciones.
- Buscar artículos por título o contenido.
- Crear nuevas publicaciones.
- Editar y eliminar publicaciones propias.
- Consultar los detalles de los artículos.
- Agregar comentarios.
- Interactuar con las publicaciones.

Las operaciones se conectan con la API REST del backend.

### Mi Huerta

Esta sección permite que los usuarios organicen las plantas de su huerta personal.

Entre sus funcionalidades se encuentran:

- Visualizar las plantas registradas.
- Agregar nuevas plantas desde el catálogo disponible.
- Indicar la cantidad de plantas.
- Registrar la fecha de plantación.
- Agregar notas.
- Editar y eliminar plantas registradas.
- Consultar un calendario de riego.
- Acceder a información sobre los cuidados de cada planta.

Los datos se guardan en el backend y están asociados al usuario autenticado.

### Insumos

Permite consultar y registrar productos relacionados con la jardinería y el mantenimiento de las huertas.

Sus principales funcionalidades son:

- Visualizar los insumos disponibles.
- Buscar productos por nombre o descripción.
- Filtrar productos por categoría.
- Consultar el precio y el stock disponible.
- Agregar nuevos insumos.
- Editar y eliminar productos registrados.

Las operaciones de administración están sujetas a los permisos del usuario.

### Talleres

Esta sección permite consultar y gestionar talleres y eventos relacionados con la jardinería.

Sus funcionalidades incluyen:

- Visualizar los talleres disponibles.
- Buscar talleres por nombre, facilitador, lugar o descripción.
- Consultar fechas, precios y cupos disponibles.
- Crear nuevos talleres.
- Editar y eliminar talleres registrados.
- Acceder a las opciones de inscripción disponibles.

Las operaciones de creación, edición y eliminación están restringidas a usuarios con permisos de administración.

### Inicio de sesión y registro

La aplicación cuenta con formularios que permiten a los usuarios iniciar sesión y registrarse.

Estas funcionalidades se conectan con el sistema de autenticación JWT del backend.

Una vez iniciada la sesión, el usuario puede acceder a las funcionalidades que requieren autenticación.

---

## Autenticación y permisos

El frontend implementa un sistema de autenticación conectado con Django REST Framework.

Se utiliza JWT para gestionar el acceso a los recursos protegidos.

La aplicación cuenta con:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Control de acceso a determinadas páginas.
- Restricciones según los permisos del usuario.
- Protección de operaciones administrativas.

Durante las pruebas se verificó que un usuario común puede consultar los talleres, pero no acceder al formulario de creación reservado para administradores.

---

## Instalación y ejecución del frontend

Para ejecutar el frontend es necesario tener instalados Node.js y npm.

### 1. Ingresar a la carpeta del frontend

Desde la carpeta principal del proyecto:

```bash
cd frontend
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Iniciar el servidor

```bash
npm run dev
```

La aplicación se puede visualizar desde el navegador en:

`http://localhost:3000`

### 4. Generar una compilación de producción

```bash
npm run build
```

Este comando permite comprobar que el proyecto compila correctamente.

---

## Conexión con el backend

El frontend se comunica con la API REST desarrollada con Django REST Framework.

La configuración de conexión se encuentra principalmente en el archivo:

`frontend/src/lib/api.ts`

Durante el desarrollo local, el backend se ejecuta normalmente en:

`http://127.0.0.1:8000`

La conexión permite obtener y enviar información relacionada con las plantas, publicaciones, insumos, talleres y usuarios.

### Variables de entorno

La aplicación utiliza una configuración de conexión con la API que permite comunicarse con el backend.

En desarrollo local se utiliza el servidor Django y, en producción, el backend publicado en Render.

---

## Pruebas automatizadas

Se implementaron pruebas automatizadas utilizando **Vitest** para verificar el funcionamiento de determinadas solicitudes realizadas a la API.

Las pruebas comprueban el comportamiento de las solicitudes, incluyendo respuestas correctas y manejo de errores.

### Ejecución de las pruebas

Desde la carpeta del frontend:

```bash
npm run test
```

### Resultados obtenidos

En la última ejecución verificada se realizaron **4 pruebas automatizadas**, todas con resultados satisfactorios.

- **Pruebas ejecutadas:** 4.
- **Pruebas aprobadas:** 4.
- **Errores:** 0.

### Verificación de compilación

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

La compilación del frontend finalizó correctamente.

---

## Despliegue en producción

El frontend de Verde-Urbano se encuentra publicado en Vercel.

**Frontend:** https://verde-urbano-two.vercel.app/

**Backend:** https://verde-urbano-backend.onrender.com/

La aplicación publicada se conecta con la API REST para gestionar los datos del sistema.

Durante las pruebas se verificó el funcionamiento de las principales secciones desde el entorno de producción.

---

## Evidencias de funcionamiento

Las capturas de pantalla se encuentran incorporadas en el README principal del repositorio.

Se documentaron las siguientes pantallas:

1. Página de inicio.
2. Blog — Listado de publicaciones.
3. Blog — Crear publicación.
4. Mi Huerta — Plantas registradas y calendario de riego.
5. Mi Huerta — Agregar planta.
6. Insumos — Listado de productos.
7. Insumos — Agregar producto.
8. Talleres — Listado de talleres.
9. Talleres — Crear taller.
10. Talleres — Taller registrado.
11. Inicio de sesión.
12. Registro de usuario.
13. Pruebas automatizadas del frontend.

---

## Estado del proyecto

El frontend de Verde-Urbano se encuentra desarrollado, integrado con el backend y publicado en producción.

Se implementaron las pantallas principales, la navegación, los formularios, las operaciones CRUD, la autenticación y las restricciones de acceso.

También se realizaron pruebas automatizadas y se verificó la compilación del proyecto.

Las principales funcionalidades fueron probadas tanto en desarrollo como en producción.

---

## Proyecto académico

Proyecto desarrollado para las materias **Programación III e Ingeniería de Software**.

**Nombre del proyecto:** Verde-Urbano.

**Integrantes:**

- Lucía Agostini.
- Abril Galíndez.
- Eliana Tallone.
- Lucila Giordano.

**Repositorio:** https://github.com/A-galindez/Verde-Urbano
