# MANUAL TÉCNICO Y ARQUITECTURA (PROYECTO ACCAR)

Este documento contiene la estructura y lógica de la aplicación. Guárdalo y pégalo en futuros chats para restablecer el contexto exacto del proyecto.

## 1. Arquitectura y Árbol del Sitio
* **Raíz (`/`)**
  * `index.html`: Punto de entrada SPA.
  * `app.js`: Motor de enrutamiento y carga de vistas.
  * `db-multimedia.js`: Base de datos JSON en memoria.
  * `global.css`: Estilos y variables CSS globales.
  * `vercel.json`: Reglas de ruteo del servidor y proxies.
* **Componentes (`/components/`)**
  * `header.html` (Motor Litúrgico) y `footer.html`.
* **Vistas (`/views/`)**
  * `inicio.html`, `apologetica.html`, `preguntas-frecuentes.html`, `formacion.html`, `biblioteca.html`, `visor.html`, `peliculas.html`, `adoracion.html`, `actualidad.html`.
* **Directorio Bíblico (`/views/directorio_biblico/`)**
  * `directorio_personajes.html`, `personaje.html`, `cargador-datos.html`.

## 2. Lógica del Motor SPA
El ruteo recae en `loadView(url)` dentro de `app.js`, inyectando el HTML en `<main id="spa-content">`. Usa `runScripts()` para reinyectar etiquetas `<script>` y asegurar la interactividad.

## 3. Manejo de Datos
* **Memoria Local:** JSON gigantes (como `db-multimedia.js`) para contenido cerrado.
* **Firebase Firestore:** Integrado para escalabilidad en el Directorio Bíblico (`getDocs`, `getDoc`).

## 4. Sistema de Diseño (UI/UX)
* **Colores:** Azul Marino (`#0B1B3D`), Oro Papal (`#D4AF37`), Blanco Alabastro (`#fdfbf7`).
* **Estilo:** "Premium Institucional" con *glassmorphism* (`backdrop-filter`), sombras 3D y bordes dorados.

## 5. Motores Especiales
* **Motor Litúrgico:** Calcula fechas móviles e inyecta fondos según la temporada (Adviento, Cuaresma, Pascua).
* **Modal Referencial:** Inyecta citas del Magisterio dinámicamente en el DOM.
* **Test Interactivo:** Evalúa conocimientos teológicos inyectando justificaciones desde Firestore.

## 📋 TAREAS PENDIENTES (Anotadas para el futuro)
1. **Menú Desplegable (Destello):** Unificar el wrapper en `header.html` para evitar cortes en el `:hover`.
2. **Menú Móvil:** Ajustar posicionamiento y estética del panel colapsable.
3. **Scroll SPA:** Modificar `window.scrollTo({ top: 0 })` en `app.js` para evitar perder el foco al abrir secciones internas.
