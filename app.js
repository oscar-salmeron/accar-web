const SPA_CONTAINER = document.getElementById('spa-content');

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

window.loadView = async function(url) {
  const res = await fetch(url);
  const html = await res.text();
  SPA_CONTAINER.innerHTML = html;
  runScripts(SPA_CONTAINER);
  
  // --- NUEVO: Cerrar el menú móvil automáticamente al cargar cualquier vista ---
  const mobileMenuToggle = document.getElementById('accarMobileMenuToggle');
  const mobileNavPanel = document.getElementById('accarMobileNavPanel');
  if (mobileNavPanel && mobileNavPanel.classList.contains('active')) {
    mobileMenuToggle.classList.remove('active');
    mobileNavPanel.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    // Cierra también los submenús que hayan quedado abiertos
    document.querySelectorAll('#accarGlobalHeader .accar-mobile-dropdown').forEach(item => item.classList.remove('open'));
  }

  // --- NUEVO: Romper el "hover pegado" de los menús de escritorio en iPad/Tablets ---
  const desktopDropdowns = document.querySelectorAll('#accarGlobalHeader .accar-dropdown-menu');
  desktopDropdowns.forEach(menu => {
    menu.style.display = 'none'; // Lo oculta forzosamente para romper el hover del iPad
    setTimeout(() => {
      menu.style.display = ''; // Le devuelve el control al CSS casi instantáneamente
    }, 50);
  });
  // ---------------------------------------------------------------------------

  // Lógica de desplazamiento inteligente condicionada
  if (url.includes('inicio.html')) {