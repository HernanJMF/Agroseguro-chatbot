# Agrobot Jurídico

**Agrobot Jurídico** es una aplicación móvil dirigida al ámbito jurídico que permite a los usuarios interactuar con tópicos particulares mediante un chat con una IA. Esta inteligencia artificial analizará los documentos que posee el tópico y permitirá hacer preguntas, obteniendo respuestas relacionadas con el contenido de esos documentos. Además, permitirá crear tickets en Monday.


Además, los usuarios pueden copiar las respuestas obtenidas al portapapeles y compartirlas con otros usuarios desde cualquier plataforma, facilitando la colaboración en proyectos o discusiones.

**Agrobot Jurídico** ha sido cuidadosamente codificado con comentarios claros en todos sus archivos TS, SCSS y HTML. SCSS se ha utilizado para aumentar la personalización del código.

## Instalación

Nota importante: para instalarlo a través de npm/Yarn, necesita al menos Node.js 14 o superior.

#### Paso 1

Descargar el codigo del repositorio mediante github o git bash con el comando
```bash
git clone https://github.com/NEWTOMS2/smart-agent-mobile-app.git
```

#### Paso 2

Instalar las dependencias del proyecto con el comando
```bash
  npm install
```

#### Paso 3

Para ejecutar el proyecto de forma local se debe usar el comando
```bash
  ionic serve
```

## Despliegue Movil

Para generar el archivo .APK e instalar el proyecto en android es necesario tener instalado Android Studio y seguir la siguiente serie de pasos.

#### Paso 1

Si no posees la libreria "capacitor" en tu proyecto es necesario instalarla para proceder con los pasos posteriores, en caso contrario puedes saltar este paso.
```bash
    npm install @capacitor/android
```

para el compilado en IOS se necesitaria instalar.
```bash
    npm install @capacitor/ios
```

#### Paso 2

Compila el proyecto con el comando
```bash
    ionic build
```

Esto generara la carpeta "www" que es el compilado web propio de Angular.

#### Paso 3

Genera el compilado para Android Studio con el comando
```bash
    npx cap add android 
```
para el compilado en IOS el comando seria.
```bash
    npx cap add ios 
```

Si no es tu primera vez generando el archivo compilado dentro del proyecto, sincroniza unicamente los ultimos cambios usando.
```bash
    npx cap sync
```

Estos pasos crearan la carpeta "android" que posee los archivos de compilación del proyecto para correrlos en Android Studio. En el caso de iphone creada una carpeta llamada "ios" que podra ser usada en Xcode.

#### Paso 4 

Para abrir el proyecto en Android Studio puedes utilizar el comando.

```bash
    npx cap open android
```

#### Paso 5

Finalmente Debes seleccionar en la barra de superior izquierda de opciones la opcion "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK(s)". el cual generara el archivo .apk que podras instalar y pruebas desde el celular. Puedes abrir la ubicación de este archivo seleccionando "locate" en el mensaje emergente de exito cuando la app se haya generado.

#### Notas

-  Puedes cambiar el logo del app que se genera para android desde Android Studio. Puedes guiarte del siguiente video https://www.youtube.com/watch?v=m6qBOTjZ4Lw

-  Es posible desplegar para IOS con un proceso similar pero usando Xcode en lugar de Android Studio.

-  Android no permite tener dos aplicaciones generadas de la misma manera asi que tendras que borrar la version anterior con cada nuevo .apk creado o con proyectos generados por la misma via. El proceso para desplegar producción es diferente.

-  El proceso para montar el proyecto en Play Store o Apple Store no ha sido investigado ni probado todavia.

## Despliegue Web

El proyecto está configurado para que se realice el despliegue automáticamente a AWS Amplify cuando se realice un push o pull request a la rama del ambiente respectivo, estas ramas siempre deberian terminar con el nombre “-enviroment” (con excepción de la rama de producción “main” y "develop") y son solamente utilizadas para despliegues no deben ser usadas para realizar cambios. Actualmente existen las siguientes ramas de github:

- main

- develop

- HURS

## Dependencias

Las principales librerías utilizadas para el desarrollo de este proyecto son las siguientes:

-	**Angular Cli**: El frontend de la aplicación esta desarrollado bajo el uso del framework Angular 15.2.9.

-   **Ionic**: El framework para desarrollar la aplicacion hibrida para dispositivos móviles es Ionic v7.0.0.

-	**NodeJs**: Se utiliza **NodeJs** versión **14.15.4 LTS o superior** como ambiente de ejecución.

-	**bootstrap, primeng y primeicons**: para reutilizar componentes, diseños, sistema de rejilla, iconos, etc.

-    Se utiliza **HTML5, CSS3 y JavaScript (ECMAScript 5)** para el desarrollo de la aplicación web.

## Estructura del proyecto

El proyecto está organizado en módulos y posee una estructura de carpetas altamente escalable, bajo una estructura de carpetas. El proyecto sigue de cerca la estructura de Folders by features (carpetas por característica de la aplicación) de la guía de estilo angular, lo que permite a su vez el desarrollo de una aplicación modularizada.

**CORE**

El Core se encarga de mantener los servicios globales, que suelen incluir servicios HTTP para comunicarse con una API. También se utiliza para almacenar guards, modelos y otras dependencias globales, como el interceptor HTTP y el controlador de errores global.

1.	**Guards**: son servicios especiales que ayudan a otorgar o revocar el acceso a las rutas.
2.	**HTTP**: Es la configuración general para generar las peticiones.
3.	**http-Interceptors**: ayudan a interceptar o modificar solicitudes y respuestas.
4.	**Json**: Se usa para almacenar los textos, idiomas, variables o configuraciones de la aplicación. 
5.  **Services**: Contiene la lógica de las vistas para generar peticiones o hacer modificaciones o cálculos de datos.


**SHARED**

Es donde deben ir los componentes, pipes / filters y modelos de datos. los componentes dentro de shared se puede importar en cualquier otro módulo cuando se necesite reutilizar esos elementos. El módulo compartido no debería depender del resto de la aplicación y, por lo tanto, no debería depender de ningún otro módulo.

La carpeta Shared contiene código que se usará múltiples veces en varios módulos, se utiliza solo para mantener componentes, pipes y directivas comunes en toda la aplicación.

1.	**Componentes**: contendrá los componentes que son comunes en toda la aplicación, como encabezado, barra de navegación, tablas y cuadro de información de documentos.
2.	**Pipes**: Tienen por objetivo transformar un dato a mostrar para mejorar la experiencia del usuario.
3.	**Models**: posee una lista de estructuras de datos utilizados para los request y los responses de toda la aplicación.
4.	**Directivas**: Las directivas son las funciones que se ejecutarán cada vez que el compilador Angular las encuentre.

MODULES

Es La carpeta modules se encarga de contener los módulos los cuales se encargan de renderizar las vistas usando inputs y outputs, el mismo contendrá los directorios y archivos para el manejo de directivas, routing y servicios de este. Un Módulo no exporta nada excepto el componente, por lo que todo lo que definimos dentro de él no se utilizará en ningún otro lado.

Cada conjunto de módulos está separado por dominios funcionales, estos dominios funcionales se crean para separar y delimitar un conjunto de módulos de forma que sea fácil de ubicar.

Cada carpeta de module contendrá:

-	**vista.module.ts**: Es la configuración de las librerías, pantallas y utilidades que poseerá el modulo

-	**vista-routing.module**: Contiene la configuración de las diferentes subrutas del módulo.

-	**Carpeta Page**: Contiene el componente padre donde se usarán el conjunto de subcomponentes para armar la vista.

-	**Carpeta components**: contiene todos los subcomponentes que conforman la funcionalidad que estará en el componente padre.

## Shared

La carpeta shared se utiliza para aquellos componentes o elementos de Angular que pueden ser reutilizados múltiples veces. Entre ellos en este proyecto se encuentran los siguientes:

| Carpeta | Archivo    | Descripción |
| :-------- | :----- | :------------|
| Component | loading | Contiene un componente que sirve para activar o desactivar la animación de carga de la plataforma. |
| Component | messages | Es un componente reutilizable utilizado para poner mensajes informativos o de ayuda al usuario. |

## Modulos

La carpeta modules posee todos los módulos (conjunto de pantallas) que forman una funcionalidad o proceso de la plataforma, estos están separados en dominios funcionales basados en las propiedades y funcionalidades del proyecto. Los dominios funcionales del proyecto son:
1.	**chat**: En él se encuentran todos los componentes que involucren conversación con tópicos o documentos.


| Carpeta | Descripción |
| :-------- |  :------------|
| chat | Es la vista del chat con el tópico, la cual permite conversar con el conectándose via rest. Puedes generar preguntas, recibir respuestas, ver la información del documento o vaciar el chat. La misma posee las validaciones para visualizar un documento, un tópico o los documentos de un tópico. Tambien posee un modal con la posibilidad de crear tickets de monday. |

## Core
La carpeta core es utilizada para tener almacenar el contenido lógico para nuestras aplicaciones, lo cual sirve para mantener una base de código bien estructurada y escrita. ayuda a guardar servicios que tengan una sola referencia de los datos.


| Carpeta | Descripción |
| :-------- |  :------------|
| http | Es un servicio que centraliza todas las peticiones de tipo http para que en los servicios de los componentes se puedan centrar en el mapeo y validaciones de datos|
| json | Es una carpeta que contiene todos los JSON del proyecto. Estos JSON se utilizan para configurar varias de las funcionalidades de los componentes de la plataforma como lo pueden ser los componentes compartidos de "Consult" así como posee los textos de todas las pantallas en diversos idiomas para que sea más fácil de ubicar y actualizar el texto de estas. Finalmente se puede usar para configurar valores globales de la aplicación|
| services |Contiene todos los servicios existentes de cada componente, donde se maneja la lógica de las peticiones http, los mapeos de datos o la comunicación entre los componentes compartidos y los módulos.|

## Servicios

| Carpeta | Descripción |
| :-------- |  :------------|
| config |Este servicio actúa como el gestor de configuraciones de la aplicación. El objetivo principal es permitirle acceder a los archivos. json que contienen textos y configuraciones utilizados en diferentes partes de la aplicación. |
| chat | Proporciona métodos que permiten enviar y recibir mensajes en el chat por medio de rest, también permite realizar diversas acciones como obtener la lista de topicos o generar un ticket.|
| loading |Este servicio se encarga de gestionar los estados de carga de la aplicación, permite mostrar u ocultar los componentes de carga según sea necesario, especialmente si se está obteniendo información asíncrona o realizando otra operación que requieran tiempo. |
| messages |Este servicio se encarga de la gestión y emisión de las notificaciones de tipo toast dentro de la aplicación. Esta funcionalidad facilita la comunicación entre los diferentes componentes, permitiéndoles enviar y recibir notificaciones para informar al usuario sobre eventos importantes o mensajes relevantes.|

### ApiUrl

| URL             || Descripción                                    |
| ----------------- | -----------------------------|------------------------------------- |
| https://pwc60wxz22.execute-api.us-east-1.amazonaws.com/dev|| Esta es la URL de la api encargada de atender todas las peticiones y la logica que pueda estar unicamente en los servicios |



## Enrutamiento

El apartado del Routing se encarga de definir las URL que cargaran los diferentes módulos de la aplicación, muchos de estos módulos tienen restricciones especificas dependiendo del rol y el acceso.

| URL | Archivo    | Permiso |
| :-------- | :----- | :---------|
| /chat | chat.module | Ninguno |

## Diagramas

[Documentación en Miro](https://miro.com/app/board/uXjVKPR3xZM=/?share_link_id=274989873881)

## Colección de Postman

[Postman Collection](https://lunar-star-442028.postman.co/workspace/Chat2Dox~a86e1589-2828-45d7-80f1-40039f14db5d/collection/12534251-335caf8b-aa16-4ab1-8b00-28e810aa0e92?action=share&creator=12534251&active-environment=12534251-c06682c5-dddc-4dc4-af80-290012d73b57)
