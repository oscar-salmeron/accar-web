Documento Maestro de Contexto: Proyecto ACCAR

Proyecto: Apologética Católica Cristiana Apostólica Romana (ACCAR).

Arquitectura: Single Page Application (SPA) 100% Vanilla JS, HTML y CSS.

Regla Estricta: Cero dependencias externas. No se usa Firebase ni bases de datos en tiempo real. Todo el contenido dinámico se maneja mediante objetos JSON locales en memoria para garantizar máxima velocidad y ejecución a nivel de archivos.



1\. El Motor (app.js)



Maneja la navegación con las funciones loadComponent (para componentes fijos) y loadView (para inyectar vistas dinámicas dentro de <main id="spa-content">).



Incluye una función runScripts que extrae y reinyecta las etiquetas <script> al cargar nuevas vistas para asegurar que el código JS local de cada fragmento se ejecute.



2\. Sistema de Diseño (UI/UX)



Colores Globales: Azul Marino Institucional (#0B1B3D / #09172d), Oro Papal (#d4af37), Oro Claro (#e4c76a) y Blanco Alabastro/Crema (#fdfbf7 / #f8efd3).



Tipografía: Fuentes clásicas y solemnes (Georgia, Lora, Cinzel).



Estética: Premium, glassmorphism (fondos translúcidos), sombras profundas para efecto 3D (box-shadow), y botones estilo "Split Button" en el header para evitar parpadeos de recarga.



3\. Vistas Activas y Terminadas



inicio.html: Posee un Motor Litúrgico JS que cambia el fondo (Navidad, Pascua, etc.) calculando fechas móviles. Incluye widget de Vatican News y reloj de Roma en vivo.



actualidad.html: Muro de noticias con conexión a medios eclesiales y transmisión de Vatican Media.



adoracion.html: Transmisión en vivo desde Polonia. Incluye un misal en pestañas (Latín/Español) con detención automática de audios al cambiar de himno y reloj sincronizado.



preguntas-frecuentes.html: Módulo complejo que inyecta contenido desde un JS estructurado por categorías (Doctrina, Escritura, Autoridad, Tradición). Incluye un acordeón dinámico y un Modal Premium con efecto blur que despliega citas literales (Magisterio, Concilios, Biblia) al presionar chips de referencia.



apologetica.html / contacto.html / construccion.html: Vistas de navegación, formularios y contingencia terminadas bajo el mismo estándar visual.



4\. Estado Actual / Siguiente Tarea



Página: peliculas.html (Catálogo Multimedia).



Contexto: El lienzo UI de la página madre ya tiene 9 tarjetas de categorías (Jesucristo, María, Santos, Iglesia, Biblia, Documentales, Papas, Catequesis, Apologética).



Objetivo pendiente: Crear la "Plantilla Dinámica" o "Molde" en JS (similar a la lógica de preguntas frecuentes) para almacenar los enlaces de videos y las rutas de las imágenes en un JSON/Array local. Las 9 tarjetas deben enviar su ID al molde para inyectar y pintar el contenido sin necesidad de crear 9 archivos HTML separados.

