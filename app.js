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
  
  // Desplazamiento inteligente: En lugar de saltar al tope absoluto,
  // desliza suavemente hasta el inicio del contenido principal.
  const offsetTop = SPA_CONTAINER.getBoundingClientRect().top + window.scrollY - 30;
  window.scrollTo({ top: offsetTop, behavior: "smooth" });
};

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent('siteHeader', 'components/header.html'),
    loadComponent('siteFooter', 'components/footer.html')
  ]);
  loadView('views/inicio.html');
});