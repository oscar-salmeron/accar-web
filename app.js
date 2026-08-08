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
  
  // Lógica de desplazamiento inteligente condicionada
  if (url.includes('inicio.html')) {
    // Si es el inicio, subimos al tope absoluto para ver el Ticker y la tarjeta Hero completa
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Si es otra sección, bajamos hasta el contenedor SPA para saltar la imagen del header.
    // Restamos 38px para compensar el Ticker superior (que es 'sticky'),
    // evitando que tape la parte superior de la nueva sección.
    const offsetTop = SPA_CONTAINER.getBoundingClientRect().top + window.scrollY - 38;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent('siteHeader', 'components/header.html'),
    loadComponent('siteFooter', 'components/footer.html')
  ]);
  loadView('views/inicio.html');
});