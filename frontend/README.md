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

Permite consultar y registrar productos relacionados con la jardinería y el mantenimiento
