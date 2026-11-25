import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const SPA_CONTAINER = document.getElementById('spa-content');

// ==========================================
// 1. INICIALIZACIÓN DE FIREBASE (MODULAR)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDSCSWYM5dgkIfVK-uBe1oWkeU7se4fvFg",
    authDomain: "accar-web.firebaseapp.com",
    projectId: "accar-web",
    storageBucket: "accar-web.firebasestorage.app",
    messagingSenderId: "249370548582",
    appId: "1:249370548582:web:6b35298df41771113910a7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

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
// 3. CONTROLADOR UNIVERSAL DE INTERFAZ
// ==========================================
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

window.toggleAccordion = function(idBloque) {
    const bloque = document.getElementById(idBloque);
    if(!bloque) return;
    const icono = bloque.querySelector('.icon-toggle');
    if (bloque.classList.contains('active')) {
        bloque.classList.remove('active');
        icono.innerText = "+";
        icono.style.transform = "rotate(0deg)";
    } else {
        bloque.classList.add('active');
        icono.innerText = "-";
        icono.style.transform = "rotate(180deg)";
    }
};

window.showTestament = function(testament) {
    const introCanon = document.getElementById('intro-canon');
    const introDir = document.getElementById('intro-directory');
    if(introCanon) introCanon.style.display = 'none';
    if(introDir) introDir.style.display = 'none';
    
    const otContainer = document.getElementById('ot-container');
    const ntContainer = document.getElementById('nt-container');
    
    if(otContainer) otContainer.style.display = testament === 'ot' ? 'flex' : 'none';
    if(ntContainer) ntContainer.style.display = testament === 'nt' ? 'flex' : 'none';
    
    localStorage.setItem('testamentoActivo', testament);
};

window.volverInicio = function() {
    const introCanon = document.getElementById('intro-canon');
    const introDir = document.getElementById('intro-directory');
    if(introCanon) introCanon.style.display = 'block';
    if(introDir) introDir.style.display = 'block';
    
    const otContainer = document.getElementById('ot-container');
    const ntContainer = document.getElementById('nt-container');
    if(otContainer) otContainer.style.display = 'none';
    if(ntContainer) ntContainer.style.display = 'none';
    
    localStorage.removeItem('testamentoActivo');
};

// ==========================================
// 4. SISTEMA UNIVERSAL DEL TEST INTERACTIVO
// ==========================================
let quizData = [];
let quizIndex = 0;
let quizScore = 0;

window.abrirModal = function() {
    if(quizData.length === 0) { alert("Test no disponible."); return; }
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
    const qTotalEl = document.getElementById('q-total-ui');
    if(qTotalEl) qTotalEl.innerText = quizData.length;
    
    document.getElementById('q-text').innerText = q.pregunta || q.question;
    
    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    document.getElementById('just-box').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    const opciones = q.opciones || q.options;
    opciones.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; 
        btn.innerText = opt;
        btn.onclick = () => window.seleccionarRespuesta(i, btn);
        optionsBox.appendChild(btn);
    });
};

window.seleccionarRespuesta = function(seleccionado, btnEl) {
    const q = quizData[quizIndex];
    const correcta = q.correcta !== undefined ? q.correcta : q.correct;
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
        msg.innerHTML = "<strong>¡Excelente!</strong><br>Has demostrado una profunda asimilación de la doctrina."; 
        msg.style.color = "var(--success)"; 
    }
    else if (quizScore > 0) { 
        msg.innerHTML = "<strong>¡Buen esfuerzo!</strong><br>Te invitamos a repasar la lectura para consolidar los detalles teológicos."; 
        msg.style.color = "var(--primary-light)"; 
    }
    else { 
        msg.innerHTML = "Te sugerimos releer el documento con detenimiento para captar la verdad salvífica del texto."; 
        msg.style.color = "var(--error)"; 
    }
};

// ==========================================
// 5. CONTROLADORES DE VISTA (CANON)
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

const formatearTexto = (texto) => {
    if (!texto) return "";
    if (texto.includes('\n')) return `<p>${texto.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    return `<p>${texto}</p>`;
};

const formatearTextoPersonaje = (texto) => {
    if (!texto) return "";
    if (texto.includes('\n')) return `<p>${texto.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    const oraciones = texto.split(/\.\s+(?=[A-ZÁÉÍÓÚ¿¡])/);
    let html = "";
    let bloque = "";
    for (let i = 0; i < oraciones.length; i++) {
        bloque += oraciones[i] + ". ";
        if ((i + 1) % 2 === 0 || i === oraciones.length - 1) {
            html += `<p>${bloque.trim()}</p>`;
            bloque = "";
        }
    }
    return html.replace(/\.\.<\/p>/g, '.</p>');
};

async function initCanonView() {
    const testamentoGuardado = localStorage.getItem('testamentoActivo');
    if (testamentoGuardado) showTestament(testamentoGuardado);

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

    for (let key in grids) if (grids[key]) grids[key].innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "canon_biblico", "libros", "registros"));
        if (querySnapshot.empty) {
            if(grids["Pentateuco"]) grids["Pentateuco"].innerHTML = `<p class="empty-text">Aún no se han subido libros al canon.</p>`;
        } else {
            const librosArray = [];
            querySnapshot.forEach((doc) => librosArray.push({ id: doc.id, data: doc.data() }));

            librosArray.sort((a, b) => {
                const indexA = ordenCanonico.indexOf(a.id);
                const indexB = ordenCanonico.indexOf(b.id);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            });

            librosArray.forEach((libroObj) => {
                const data = libroObj.data;
                const idLibro = libroObj.id;
                const imagen = `/assets/img/libro_${idLibro}.png`;
                const categoriaDestino = data.categoria || "Pentateuco";

                const tarjetaHTML = `
                    <a href="#" onclick="event.preventDefault(); localStorage.setItem('libroSeleccionado', '${idLibro}'); loadView('/views/canon_biblico/libro.html');" class="book-card">
                        <div class="book-cover"><img src="${imagen}" alt="Portada" onerror="this.src='https://placehold.co/120x180/09172d/d4af37?text=Libro+Sagrado'"></div>
                        <h2 class="book-title">${data.titulo || 'Libro'}</h2>
                        <div class="book-subtitle">${data.subtitulo_corto || ''}</div>
                    </a>`;

                if (grids[categoriaDestino]) grids[categoriaDestino].innerHTML += tarjetaHTML;
                else if (grids["Pentateuco"]) grids["Pentateuco"].innerHTML += tarjetaHTML;
            });

            for (let key in grids) {
                if (grids[key] && grids[key].innerHTML.trim() === "") {
                    grids[key].innerHTML = `<p class="empty-text">Próximamente se añadirán libros a esta sección.</p>`;
                }
            }
        }
    } catch (error) {
        console.error("Error obteniendo libros: ", error);
        if(grids["Pentateuco"]) grids["Pentateuco"].innerHTML = `<p class="loading-text" style="color: #f87171;">Error de conexión con la base de datos.</p>`;
    }
}

async function initLibroView() {
    const libroId = localStorage.getItem('libroSeleccionado') || 'genesis'; 
    try {
        const docRef = doc(db, "canon_biblico", "libros", "registros", libroId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const l = docSnap.data();
            const tituloEl = document.getElementById('titulo-libro');
            const subEl = document.getElementById('subtitulo-libro');
            const imgEl = document.getElementById('img-portada');
            
            if(tituloEl) tituloEl.innerText = l.titulo || "Libro Sagrado";
            if(subEl) subEl.innerText = l.subtitulo_corto || "";
            if(imgEl) imgEl.src = `/assets/img/libro_${libroId}.png`;

            const f_autoria = (l.ficha_tecnica && l.ficha_tecnica.autoria) ? l.ficha_tecnica.autoria : "No disponible";
            const f_fecha = (l.ficha_tecnica && l.ficha_tecnica.fecha) ? l.ficha_tecnica.fecha : "No disponible";
            const f_dest = (l.ficha_tecnica && l.ficha_tecnica.destinatarios) ? l.ficha_tecnica.destinatarios : "No disponible";
            const f_generos = (l.ficha_tecnica && l.ficha_tecnica.generos) ? l.ficha_tecnica.generos : "No disponible";

            let htmlContent = `
                <h2>1. Ficha Técnica y Visión General</h2>
                <div class="ficha-tecnica">
                    <ul><li><strong>Autoría:</strong> ${f_autoria}</li><li><strong>Fecha:</strong> ${f_fecha}</li><li><strong>Destinatarios:</strong> ${f_dest}</li><li><strong>Géneros:</strong> ${f_generos}</li></ul>
                </div>`;
            if (l.contexto_proposito) htmlContent += `<h2>2. Contexto y Propósito Divino</h2>${formatearTexto(l.contexto_proposito)}`;
            if (l.exegesis_hermeneutica) htmlContent += `<h2>3. Exégesis y Hermenéutica Católica</h2>${formatearTexto(l.exegesis_hermeneutica)}`;
            if (l.sentido_tipologico) htmlContent += `<h2>4. Sentido Tipológico y Cristológico</h2>${formatearTexto(l.sentido_tipologico)}`;
            if (l.uso_liturgico) htmlContent += `<h2>5. Uso Litúrgico y Fruto Espiritual</h2>${formatearTexto(l.uso_liturgico)}`;
            if (l.versiculos_clave) htmlContent += `<h2>6. Versículos Clave</h2><div class="versiculos-box">${l.versiculos_clave}</div>`;

            const mainContent = document.getElementById('main-content');
            if(mainContent) mainContent.innerHTML = htmlContent;

            if (l.test && l.test.length > 0) {
                quizData = l.test;
                const btnCta = document.getElementById('cta-test');
                if(btnCta) btnCta.style.display = 'block';
            }
        } else {
            const mainContent = document.getElementById('main-content');
            if(mainContent) mainContent.innerHTML = `<p style="color: var(--error); text-align: center;">Documento no encontrado.</p>`;
        }
    } catch (error) {
        console.error("Error al cargar libro:", error);
        const mainContent = document.getElementById('main-content');
        if(mainContent) mainContent.innerHTML = `<p style="color: var(--error); text-align: center;">Error de conexión.</p>`;
    }
}

// ==========================================
// 6. CONTROLADORES DE VISTA (PERSONAJES)
// ==========================================
async function initDirectorioPersonajesView() {
    const testamentoGuardado = localStorage.getItem('testamentoActivo');
    if (testamentoGuardado) showTestament(testamentoGuardado);

    const grids = {
        "Genesis": document.getElementById('grid-genesis'), "Exodo": document.getElementById('grid-exodo'),
        "Levitico": document.getElementById('grid-levitico'), "Numeros": document.getElementById('grid-numeros'),
        "Deuteronomio": document.getElementById('grid-deuteronomio'), "Josue": document.getElementById('grid-josue'),
        "Jueces": document.getElementById('grid-jueces'), "Rut": document.getElementById('grid-rut'),
        "1 Samuel": document.getElementById('grid-1_samuel'), "2 Samuel": document.getElementById('grid-2_samuel'),
        "1 Reyes": document.getElementById('grid-1_reyes'), "2 Reyes": document.getElementById('grid-2_reyes'),
        "1 Cronicas": document.getElementById('grid-1_cronicas'), "2 Cronicas": document.getElementById('grid-2_cronicas'),
        "Esdras": document.getElementById('grid-esdras'), "Nehemias": document.getElementById('grid-nehemias'),
        "Tobias": document.getElementById('grid-tobias'), "Judit": document.getElementById('grid-judit'),
        "Ester": document.getElementById('grid-ester'), "1 Macabeos": document.getElementById('grid-1_macabeos'),
        "2 Macabeos": document.getElementById('grid-2_macabeos'), "Job": document.getElementById('grid-job'),
        "Salmos": document.getElementById('grid-salmos'), "Proverbios": document.getElementById('grid-proverbios'),
        "Eclesiastes": document.getElementById('grid-eclesiastes'), "Cantar": document.getElementById('grid-cantar'),
        "Sabiduria": document.getElementById('grid-sabiduria'), "Eclesiastico": document.getElementById('grid-eclesiastico'),
        "Isaias": document.getElementById('grid-isaias'), "Jeremias": document.getElementById('grid-jeremias'),
        "Lamentaciones": document.getElementById('grid-lamentaciones'), "Baruc": document.getElementById('grid-baruc'),
        "Ezequiel": document.getElementById('grid-ezequiel'), "Daniel": document.getElementById('grid-daniel'),
        "Oseas": document.getElementById('grid-oseas'), "Joel": document.getElementById('grid-joel'),
        "Amos": document.getElementById('grid-amos'), "Abdias": document.getElementById('grid-abdias'),
        "Jonas": document.getElementById('grid-jonas'), "Miqueas": document.getElementById('grid-miqueas'),
        "Nahum": document.getElementById('grid-nahum'), "Habacuc": document.getElementById('grid-habacuc'),
        "Sofonias": document.getElementById('grid-sofonias'), "Ageo": document.getElementById('grid-ageo'),
        "Zacarias": document.getElementById('grid-zacarias'), "Malaquias": document.getElementById('grid-malaquias'),
        "Sinopticos": document.getElementById('grid-sinopticos'), "Juan": document.getElementById('grid-juan'),
        "Hechos": document.getElementById('grid-hechos'), "Paulinas": document.getElementById('grid-paulinas'),
        "Hebreos": document.getElementById('grid-hebreos'), "Cartas Catolicas": document.getElementById('grid-cartas-catolicas'),
        "Apocalipsis": document.getElementById('grid-apocalipsis')
    };

    const aparicionesExtra = {
        "moises": ["Levitico", "Numeros", "Deuteronomio"], "aaron": ["Levitico", "Numeros", "Deuteronomio"],
        "nadab": ["Levitico"], "abiu": ["Levitico"], "eleazar": ["Levitico", "Numeros", "Deuteronomio", "Josue"],
        "itamar": ["Levitico", "Numeros"], "josue": ["Numeros", "Deuteronomio", "Josue"], "caleb": ["Numeros", "Deuteronomio", "Josue"],
        "maria": ["Numeros"], "finees": ["Numeros", "Josue", "Jueces"], "mala": ["Numeros", "Josue"], "noa": ["Numeros", "Josue"],
        "hogla": ["Numeros", "Josue"], "milca": ["Numeros", "Josue"], "tirsa": ["Numeros", "Josue"], "otoniel": ["Jueces"],
        "david_rey": ["1 Reyes", "1 Cronicas"], "salomon": ["2 Samuel", "1 Cronicas", "2 Cronicas"],
        "natan": ["1 Reyes", "1 Cronicas"], "elias": ["2 Reyes"], "eliseo": ["1 Reyes"], "esdras": ["Nehemias"]
    };

    for (let key in grids) if (grids[key]) grids[key].innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "directorio_biblico", "personajes", "registros"));

        if (querySnapshot.empty) {
            if(grids["Genesis"]) grids["Genesis"].innerHTML = `<p class="empty-text">No se encontraron registros.</p>`;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const idPersonaje = doc.id;
                const imagen = `/assets/img/${idPersonaje}.png`;
                const libroDestino = data.libro ? data.libro : "Genesis"; 
                const estiloExtra = idPersonaje === 'rafael' ? 'transform: scale(1.35) translateY(28px); transform-origin: bottom center;' : '';

                const tarjetaHTML = `
                    <a href="#" onclick="event.preventDefault(); localStorage.setItem('personajeSeleccionado', '${idPersonaje}'); loadView('/views/directorio_biblico/personaje.html');" class="accar-portrait-card">
                        <div class="portrait-frame">
                            <img src="${imagen}" alt="${data.nombre || 'Personaje'}" style="${estiloExtra}" onerror="this.src='https://placehold.co/180x280/050b1a/d4af37?text=Sin+Imagen'">
                        </div>
                        <h2 class="portrait-name">${data.nombre || 'Desconocido'}</h2>
                    </a>`;

                if (grids[libroDestino]) grids[libroDestino].innerHTML += tarjetaHTML;
                else if(grids["Genesis"]) grids["Genesis"].innerHTML += tarjetaHTML;

                if (aparicionesExtra[idPersonaje]) {
                    aparicionesExtra[idPersonaje].forEach(libroExtra => {
                        if (grids[libroExtra]) grids[libroExtra].innerHTML += tarjetaHTML;
                    });
                }
            });
            
            for (let key in grids) {
                if (grids[key] && grids[key].innerHTML.trim() === "") {
                    grids[key].innerHTML = `<p class="empty-text">No hay registros disponibles en esta sección por el momento.</p>`;
                }
            }
        }
    } catch (error) {
        console.error("Error obteniendo personajes: ", error);
        if(grids["Genesis"]) grids["Genesis"].innerHTML = `<p class="loading-text" style="color: #f87171;">Error de conexión.</p>`;
    }
}

async function initFichaPersonajeView() {
    const personajeId = localStorage.getItem('personajeSeleccionado') || 'abraham'; 
    try {
        const docRef = doc(db, "directorio_biblico", "personajes", "registros", personajeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const p = docSnap.data();
            const heroH1 = document.querySelector('.hero-text h1');
            const heroSub = document.querySelector('.hero-text .subtitle');
            const heroImg = document.querySelector('.hero-image img');

            if(heroH1) heroH1.innerText = p.titulo || p.nombre || "Personaje";
            if(heroSub) heroSub.innerText = p.subtitulo || '';
            if(heroImg) heroImg.src = `/assets/img/${personajeId}.png`;

            const f_nombre = (p.ficha_tecnica && p.ficha_tecnica.nombre) ? p.ficha_tecnica.nombre : (p.nombre || "No disponible");
            const f_significado = (p.ficha_tecnica && p.ficha_tecnica.significado) ? p.ficha_tecnica.significado : "No disponible";
            const f_linaje = (p.ficha_tecnica && p.ficha_tecnica.linaje) ? p.ficha_tecnica.linaje : "No disponible";
            const f_referencia = (p.ficha_tecnica && p.ficha_tecnica.referencia) ? p.ficha_tecnica.referencia : "No disponible";
            
            const relato = p.relato_biblico || "Relato no disponible.";
            let importancia = p.importancia_teologica || "Importancia no disponible.";

            importancia = importancia.replace(/(Cristológicamente:)/g, '<span style="color: var(--primary);">$1</span>');
            importancia = importancia.replace(/(Mariológicamente:)/g, '<span style="color: var(--primary);">$1</span>');
            importancia = importancia.replace(/(Eclesiológicamente:)/g, '<span style="color: var(--primary);">$1</span>');

            const mainContent = document.getElementById('main-content');
            if(mainContent) {
                mainContent.innerHTML = `
                    <h2>1. Ficha Técnica</h2>
                    <div class="ficha-tecnica">
                        <ul>
                            <li><strong>Nombre:</strong> ${f_nombre}</li>
                            <li><strong>Significado Espiritual:</strong> ${f_significado}</li>
                            <li><strong>Linaje:</strong> ${f_linaje}</li>
                            <li><strong>Capítulos Claves:</strong> ${f_referencia}</li>
                        </ul>
                    </div>
                    <h2>2. El Relato Bíblico (Hechos Históricos)</h2>
                    ${formatearTextoPersonaje(relato)}
                    <h2>3. Importancia en el Plan de Salvación</h2>
                    ${formatearTextoPersonaje(importancia)}
                `;
            }

            if (p.test && p.test.length > 0) {
                quizData = p.test;
                const ctaBtn = document.querySelector('.cta-invitation');
                if(ctaBtn) ctaBtn.style.display = 'block';
            }
        } else {
            const mainContent = document.getElementById('main-content');
            if(mainContent) mainContent.innerHTML = `<p style="color: var(--error); text-align: center;">No se encontró el documento.</p>`;
        }
    } catch (error) {
        console.error("Error al cargar personaje:", error);
        const mainContent = document.getElementById('main-content');
        if(mainContent) mainContent.innerHTML = `<p style="color: var(--error); text-align: center;">Error al conectar con la base de datos.</p>`;
    }
}

// ==========================================
// 7. MOTOR DE RUTEO (Router SPA)
// ==========================================
window.loadView = async function(url) {
  try {
      const fetchUrl = url.startsWith('/') ? url : `/${url}`;
      const res = await fetch(fetchUrl);
      const html = await res.text();
      SPA_CONTAINER.innerHTML = html;
      
      runScripts(SPA_CONTAINER);

      // Distribuir el controlador correcto según la vista cargada
      if (url.includes('canon.html')) {
          initCanonView();
      } else if (url.includes('libro.html')) {
          initLibroView();
      } else if (url.includes('directorio_personajes.html')) {
          initDirectorioPersonajesView();
      } else if (url.includes('personaje.html')) {
          initFichaPersonajeView();
      }
      
      const mobileMenuToggle = document.getElementById('accarMobileMenuToggle');
      const mobileNavPanel = document.getElementById('accarMobileNavPanel');
      if (mobileNavPanel && mobileNavPanel.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        mobileNavPanel.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('#accarGlobalHeader .accar-mobile-dropdown').forEach(item => item.classList.remove('open'));
      }

      if (document.activeElement) document.activeElement.blur();

      if (!url.includes('santo.html')) {
        document.body.classList.remove('theme-rojo', 'theme-blanco', 'theme-verde', 'theme-morado', 'theme-celeste', 'theme-negro', 'theme-realeza', 'theme-gloria');
        document.title = 'ACCAR - Apologética Católica';
        if (window.location.search.includes('santo=')) {
          window.history.replaceState({}, '', '/');
        }
      }

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

  const params = new URLSearchParams(window.location.search);
  const santoParam = params.get('santo');

  if (santoParam) {
    window.santoID = santoParam;
    loadView('/views/santos/santo.html');
  } else {
    loadView('/views/inicio.html');
  }
});