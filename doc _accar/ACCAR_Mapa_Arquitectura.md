# MAPA ESTRUCTURAL Y ARQUITECTURA (PROYECTO ACCAR)

Este documento refleja la arquitectura de archivos y carpetas del sitio web, diseñado como una Single Page Application (SPA).

## 📁 Raíz del Proyecto ( / )
* `index.html` - Punto de entrada principal de la SPA.
* `app.js` - Motor principal de enrutamiento y carga dinámica.
* `db-multimedia.js` - Base de datos local (JSON) para la sección de películas/videos.
* `global.css` - Estilos y variables de color globales (Azul, Oro, Crema).
* `vercel.json` - Reglas de ruteo del servidor Vercel y proxy hacia Firebase Storage.
* `.gitattributes` - Configuración del repositorio Git.

## 📁 components ( /components/ )
* `header.html` - Menú de navegación y Motor Litúrgico.
* `footer.html` - Pie de página global con enlaces y datos legales.

## 📁 views ( /views/ )
* `inicio.html` - Página principal (hero, adoración rápida, noticias, destacados).
* `apologetica.html` - Página central de Defensa de la Fe.
* `preguntas-frecuentes.html` - Acordeón dinámico y modal premium de citas magisteriales.
* `formacion.html` - Vestíbulo hacia las áreas de estudio.
* `doctrina.html` - Sub-sala: Doctrina de la Iglesia.
* `sacramentos.html` - Sub-sala: Los Sacramentos.
* `sagrada-escritura.html` - Sub-sala: Sagrada Escritura.
* `biblioteca.html` - Vestíbulo hacia el acervo documental eclesial.
* `mariologia.html` - Sala de lectura: Documentos sobre la Virgen María.
* `biblioteca-magisterio-pontificio.html` - Sala: Encíclicas y exhortaciones papales.
* `biblioteca-padres-iglesia.html` - Sala: Patrística y primeros siglos.
* `biblioteca-concilios-ecumenicos.html` - Sala: Actas y decretos conciliares.
* `biblioteca-tratados-teologicos.html` - Sala: Sumas y tratados teológicos mayores.
* `visor.html` - Renderizador de documentos PDF integrado.
* `peliculas.html` - Catálogo multimedia interactivo estilo cartelera.
* `adoracion.html` - Santuario digital (En vivo Polonia) y Misal de oraciones.
* `actualidad.html` - Muro de noticias integrado con Vatican News y redes diocesanas.
* `contacto.html` - Formulario y canales de comunicación.
* `construccion.html` - Plantilla base para secciones "Próximamente".

## 📁 directorio_biblico ( /views/directorio_biblico/ )
* `directorio_personajes.html` - Acordeones por libro bíblico alimentados por Firestore.
* `personaje.html` - Ficha teológica y Test Interactivo del personaje seleccionado.
* `cargador-datos.html` - Herramienta interna para subir los JSON a la base de datos Firebase.

## 📁 assets ( /assets/ )
* `img/` - Imágenes de fondo, portadas, retratos de papas y personajes.
* `icons/` - Iconografía SVG/PNG para tarjetas y botones.
* `css/` - Hojas de estilo secundarias.
* `data/` - Archivos locales de datos (ej. personajes.json).

## 📁 media ( /media/ )
* `cantos-eucaristicos.mp3`, `adoro-te-devote.mp3`, etc. - Pistas de audio utilizadas en adoracion.html.
* `llama_adoracion_santisimo.mp4` - Video decorativo en inicio.html.
