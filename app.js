const SPA_CONTAINER = document.getElementById('spa-content');

// ==========================================
// 1. INICIALIZACIÓN DE FIREBASE (COMPAT)
// ==========================================
// Usamos la instancia que ya se cargó en index.html
const db = firebase.firestore();

// ==========================================
// 2. UTILIDADES DE INYECCIÓN DE SCRIPTS (SPA)
// ==========================================
function runScripts(container) {
  const scripts = container.querySelectorAll("script");
  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    if (!oldScript.src) newScript.textContent = oldScript.textContent;
    document.body.appendChild(newScript);
    oldScript.remove();
  });
}

async function loadComponent(id, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
  runScripts(document.getElementById(id));
}

// ==========================================
// 3. CONTROLADOR: CANON BÍBLICO
// ==========================================
const ordenCanonico = [
    "genesis", "exodo", "levitico", "numeros", "deuteronomio",
    "josue", "jueces", "rut", "1samuel", "2samuel", "1reyes", "2reyes",
    "1cronicas", "2cronicas", "esdras", "nehemias", "tobias", "judit",
    "ester", "1macabeos", "2macabeos", "job", "salmos", "proverbios",
    "eclesiastes", "cantares", "sabiduria", "eclesiastico", "isaias",
    "jeremias", "lamentaciones", "baruc", "ezequiel", "daniel", "oseas",
    "joel", "amos", "abdias", "jonas", "miqueas", "nahum", "habacuc",
    "sofonias", "ageo", "zacarias", "malaquias"
];

window.toggleMaster = function(idBloque) {
    const bloque = document.getElementById(idBloque);
    if(!bloque) return;
    const icono = bloque.querySelector('.master-icon');
    if (bloque.classList.contains('active')) {
        bloque.classList.remove('active');
        icono.innerText = "+";
    } else {
        bloque.classList.add('active');
        icono.innerText = "-";
    }
};

window.toggleSub = function(idBloque) {
    const bloque = document.getElementById(idBloque);
    if(!bloque) return;
    const icono = bloque.querySelector('.sub-icon');
    if (bloque.classList.contains('active')) {
        bloque.classList.remove('active');
        icono.innerText = "+";
    } else {
        bloque.classList.add('active');
        icono.innerText = "-";
    }
};

window.showTestament = function(testament) {
    document.getElementById('intro-canon').style.display = 'none';
    document.getElementById('ot-container').style.display = testament === 'ot' ? 'flex' : 'none';
    document.getElementById('nt-container').style.display = testament === 'nt' ? 'flex' : 'none';
    localStorage.setItem('testamentoActivo', testament);
};

window.volverInicio = function() {
    document.getElementById('intro-canon').style.display = 'block';
    document.getElementById('ot-container').style.display = 'none';
    document.getElementById('nt-container').style.display = 'none';
    localStorage.removeItem('testamentoActivo');
};

async function initCanonView() {
    const testamentoGuardado = localStorage.getItem('testamentoActivo');
    if (testamentoGuardado) {
        showTestament(testamentoGuardado);
    }

    const grids = {
        "Pentateuco": document.getElementById('grid-pentateuco'),
        "Historicos_1": document.getElementById('grid-historicos-1'),
        "Historicos_2": document.getElementById('grid-historicos-2'),
        "Historicos_3": document.getElementById('grid-historicos-3'),
        "Historicos_4": document.getElementById('grid-historicos-4'),
        "Sapienciales": document.getElementById('grid-sapienciales'),
        "Profeticos_Mayores": document.getElementById('grid-profeticos-mayores'),
        "Profeticos_Menores": document.getElementById('grid-profeticos-menores'),
        "Evangelios": document.getElementById('grid-evangelios'),
        "Paulinas": document.getElementById('grid-paulinas'),
        "Catolicas": document.getElementById('grid-catolicas')
    };

    for (let key in grids) {
        if (grids[key]) grids[key].innerHTML = "";
    }

    try {
        // Sintaxis Compat de Firebase (Limpia y global)
        const querySnapshot = await db.collection("canon_biblico/libros/registros").get();

        if (querySnapshot.empty) {
            if(grids["Pentateuco"]) grids["Pentateuco"].innerHTML = `<p class="empty-text">Aún no se han subido libros al canon.</p>`;
        } else {
            const librosArray = [];
            querySnapshot.forEach((doc) => {
                librosArray.push({ id: doc.id, data: doc.data() });
            });

            librosArray.sort((a, b) => {
                const indexA = ordenCanonico.indexOf(a.id);
                const indexB = ordenCanonico.indexOf(b.id);
                const finalIndexA = indexA === -1 ? 999 : indexA;
                const finalIndexB = indexB === -1 ? 999 : indexB;
                return finalIndexA - finalIndexB;
            });

            librosArray.forEach((libroObj) => {
                const data = libroObj.data;
                const idLibro = libroObj.id;
                const imagen = `/assets/img/libro_${idLibro}.png`;
                const categoriaDestino = data.categoria || "Pentateuco";

                const tarjetaHTML = `
                    <a href="#" onclick="event.preventDefault(); localStorage.setItem('libroSeleccionado', '${idLibro}'); loadView('/views/canon_biblico/libro.html');" class="book-card">
                        <div class="book-cover">
                            <img src="${imagen}" alt="Portada ${data.titulo}" onerror="this.src='https://placehold.co/120x180/09172d/d4af37?text=Libro+Sagrado'">
                        </div>
                        <h2 class="book-title">${data.titulo || 'Libro'}</h2>
                        <div class="book-subtitle">${data.subtitulo_corto || ''}</div>
                    </a>
                `;

                if (grids[categoriaDestino]) {
                    grids[categoriaDestino].innerHTML += tarjetaHTML;
                } else if (grids["Pentateuco"]) {
                    grids["Pentateuco"].innerHTML += tarjetaHTML;
                }
            });

            for (let key in grids) {
                if (grids[key] && grids[key].innerHTML.trim() === "") {
                    grids[key].innerHTML = `<p class="empty-text">Próximamente se añadirán libros a esta sección.</p>`;
                }
            }
        }
    } catch (error) {
        console.error("Error obteniendo los libros: ", error);
        if(grids["Pentateuco"]) grids["Pentateuco"].innerHTML = `<p class="loading-text" style="color: #f87171;">Error de conexión con la base de datos.</p>`;
    }
}

// ==========================================
// 4. CONTROLADOR DE VISTA: LECTURA DE LIBRO
// ==========================================
let quizData = [];
let quizIndex = 0;
let quizScore = 0;

const formatearTexto = (texto) => {
    if (!texto) return "";
    return `<p>${texto}</p>`;
};

window.abrirModal = function() {
    if(quizData.length === 0) return;
    quizIndex = 0; quizScore = 0;
    document.getElementById('quiz-view').style.display = 'block';
    document.getElementById('results-view').style.display = 'none';
    document.getElementById('quizModal').classList.add('active');
    window.cargarPregunta();
};

window.cerrarModal = function() { 
    document.getElementById('quizModal').classList.remove('active'); 
};

window.cargarPregunta = function() {
    const q = quizData[quizIndex];
    document.getElementById('q-num').innerText = quizIndex + 1;
    document.getElementById('q-total-ui').innerText = quizData.length;
    document.getElementById('q-text').innerText = q.pregunta;
    
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    document.getElementById('just-box').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    q.opciones.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; 
        btn.innerText = opt;
        btn.onclick = () => window.seleccionarRespuesta(i, btn);
        optionsBox.appendChild(btn);
    });
};

window.seleccionarRespuesta = function(seleccionado, btnEl) {
    const q = quizData[quizIndex];
    const correcta = q.correcta;
    const botones = document.querySelectorAll('.option-btn');
    botones.forEach(b => b.disabled = true);

    if (seleccionado === correcta) {
        btnEl.classList.add('correct-ans'); 
        quizScore++;
    } else {
        btnEl.classList.add('wrong-ans');
        botones[correcta].classList.add('correct-ans');
    }

    document.getElementById('just-text').innerText = q.justificacion;
    document.getElementById('just-box').style.display = 'block';
    
    const btnNext = document.getElementById('next-btn');
    btnNext.innerText = (quizIndex === quizData.length - 1) ? "Ver Calificación Final" : "Siguiente Pregunta";
    btnNext.style.display = 'block';
};

window.siguientePregunta = function() {
    quizIndex++;
    if (quizIndex < quizData.length) {
        window.cargarPregunta();
    } else {
        window.mostrarResultados();
    }
};

window.mostrarResultados = function() {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('results-view').style.display = 'block';
    document.getElementById('final-score').innerText = quizScore;
    document.getElementById('total-q').innerText = quizData.length;
    
    const msg = document.getElementById('result-msg');
    if (quizScore === quizData.length) { 
        msg.innerHTML = "<strong>¡Exégesis Perfecta!</strong><br>Has demostrado una profunda asimilación de la doctrina y la hermenéutica de este libro."; 
        msg.style.color = "var(--success)"; 
    }
    else if (quizScore > 0) { 
        msg.innerHTML = "<strong>¡Buen esfuerzo!</strong><br>Te invitamos a repasar la lectura para consolidar los detalles teológicos."; 
        msg.style.color = "var(--primary-light)"; 
    }
    else { 
        msg.innerHTML = "Te sugerimos releer el documento magisterial con detenimiento para captar la verdad salvífica del texto."; 
        msg.style.color = "var(--error)"; 
    }
};

async function initLibroView() {
    const libroId = localStorage.getItem('libroSeleccionado') || 'genesis'; 
    try {
        const docSnap = await db.collection("canon_biblico/libros/registros").doc(libroId).get();

        if (docSnap.exists) {
            const l = docSnap.data();
            
            document.getElementById('titulo-libro').innerText = l.titulo || "Libro Sagrado";
            document.getElementById('subtitulo-libro').innerText = l.subtitulo_corto || "";
            document.getElementById('img-portada').src = `/assets/img/libro_${libroId}.png`;

            const f_autoria = (l.ficha_tecnica && l.ficha_tecnica.autoria) ? l.ficha_tecnica.autoria : "Dato no disponible";
            const f_fecha = (l.ficha_tecnica && l.ficha_tecnica.fecha) ? l.ficha_tecnica.fecha : "Dato no disponible";
            const f_dest = (l.ficha_tecnica && l.ficha_tecnica.destinatarios) ? l.ficha_tecnica.destinatarios : "Dato no disponible";
            const f_generos = (l.ficha_tecnica && l.ficha_tecnica.generos) ? l.ficha_tecnica.generos : "Dato no disponible";

            let htmlContent = `
                <h2>1. Ficha Técnica y Visión General</h2>
                <div class="ficha-tecnica">
                    <ul>
                        <li><strong>Autoría:</strong> ${f_autoria}</li>
                        <li><strong>Fecha:</strong> ${f_fecha}</li>
                        <li><strong>Destinatarios:</strong> ${f_dest}</li>
                        <li><strong>Géneros:</strong> ${f_generos}</li>
                    </ul>
                </div>
            `;

            if (l.contexto_proposito) htmlContent += `<h2>2. Contexto y Propósito Divino</h2>${formatearTexto(l.contexto_proposito)}`;
            if (l.exegesis_hermeneutica) htmlContent += `<h2>3. Exégesis y Hermenéutica Católica</h2>${formatearTexto(l.exegesis_hermeneutica)}`;
            if (l.sentido_tipologico) htmlContent += `<h2>4. Sentido Tipológico y Cristológico</h2>${formatearTexto(l.sentido_tipologico)}`;
            if (l.uso_liturgico) htmlContent += `<h2>5. Uso Litúrgico y Fruto Espiritual</h2>${formatearTexto(l.uso_liturgico)}`;
            if (l.versiculos_clave) {
                htmlContent += `
                    <h2>6. Versículos Clave</h2>
                    <div class="versiculos-box">
                        ${l.versiculos_clave}
                    </div>
                `;
            }

            document.getElementById('main-content').innerHTML = htmlContent;

            if (l.test && l.test.length > 0) {
                quizData = l.test;
                document.getElementById('cta-test').style.display = 'block';
            }

        } else {
            document.getElementById('main-content').innerHTML = `<p style="color: var(--error); text-align: center;">No se encontró el documento en la base de datos.</p>`;
        }
    } catch (error) {
        console.error("Error al cargar el libro:", error);
        document.getElementById('main-content').innerHTML = `<p style="color: var(--error); text-align: center;">Error al conectar con la base de datos.</p>`;
    }
}

// ==========================================
// 5. MOTOR DE RUTEO (Router SPA)
// ==========================================
window.loadView = async function(url) {
  try {
      // Manejar ruteo absoluto o relativo de manera segura
      const fetchUrl = url.startsWith('/') ? url : `/${url}`;
      
      const res = await fetch(fetchUrl);
      const html = await res.text();
      SPA_CONTAINER.innerHTML = html;
      
      runScripts(SPA_CONTAINER);

      // Desplegar controladores específicos después de inyectar el HTML
      if (url.includes('canon.html')) {
          initCanonView();
      } else if (url.includes('libro.html')) {
          initLibroView();
      }
      
      // Cerrar menú móvil
      const mobileMenuToggle = document.getElementById('accarMobileMenuToggle');
      const mobileNavPanel = document.getElementById('accarMobileNavPanel');
      if (mobileNavPanel && mobileNavPanel.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mobileNavPanel.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('#accarGlobalHeader .accar-mobile-dropdown').forEach(item => item.classList.remove('open'));
      }

      if (document.activeElement) {
        document.activeElement.blur();
      }

      // Desplazamiento inteligente
      if (url.includes('inicio.html')) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const offsetTop = SPA_CONTAINER.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
  } catch (error) {
      console.error("Error al cargar la vista: ", error);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent('siteHeader', '/components/header.html'),
    loadComponent('siteFooter', '/components/footer.html')
  ]);
  loadView('/views/inicio.html');
});