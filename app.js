const SPA_CONTAINER = document.getElementById('spa-content');

function runScripts(container) {
  const scripts = container.querySelectorAll("script");
  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");
    if (oldScript.src) newScript.src = oldScript.src;
    else newScript.textContent = oldScript.textContent;
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

async function loadView(url) {
  const res = await fetch(url);
  const html = await res.text();
  SPA_CONTAINER.innerHTML = html;
  runScripts(SPA_CONTAINER);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent('siteHeader', 'components/header.html'),
    loadComponent('siteFooter', 'components/footer.html')
  ]);
  loadView('views/inicio.html');
});