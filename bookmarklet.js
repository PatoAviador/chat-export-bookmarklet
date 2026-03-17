// Chat Export Bookmarklet
// Versión legible (para desarrollo y revisión)
// Para usar como bookmarklet, copia el contenido de bookmarklet.min.js

(function () {
  var host = location.hostname;
  var port = location.port;
  var messages = [];

  // Limpieza general de un elemento
  function clean(el) {
    var c = el.cloneNode(true);
    ['script', 'style', 'button', 'svg', '[aria-hidden]'].forEach(function (s) {
      c.querySelectorAll(s).forEach(function (n) { n.remove(); });
    });
    c.querySelectorAll('p,div,h1,h2,h3,h4,h5,li,br').forEach(function (b) {
      b.insertAdjacentText('afterend', '\n');
    });
    return c.innerText.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
  }

  // Limpieza específica para Gemini (elimina prefijos redundantes)
  function cleanGemini(el) {
    var c = el.cloneNode(true);
    ['script', 'style', 'button', 'svg', '[aria-hidden]'].forEach(function (s) {
      c.querySelectorAll(s).forEach(function (n) { n.remove(); });
    });
    c.querySelectorAll('p,div,h1,h2,h3,h4,h5,li,br').forEach(function (b) {
      b.insertAdjacentText('afterend', '\n');
    });
    var txt = c.innerText.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
    txt = txt.replace(/^(Has dicho|Tú has dicho|You said|Gemini said|Gemini ha dicho)\s*/i, '');
    return txt;
  }

  // Detección de plataforma
  var isOpenWebUI = (host === 'localhost' || host === '192.168.0.150') && port === '8080';

  if (isOpenWebUI) {
    // Open WebUI
    document.querySelectorAll('[role="listitem"]').forEach(function (el) {
      var child = el.firstElementChild;
      if (!child) return;
      var isUser = child.classList.contains('user-message');
      var txt = clean(el);
      if (txt) messages.push({ role: isUser ? 'user' : 'assistant', text: txt });
    });

  } else if (host.includes('claude.ai')) {
    // Claude
    document.querySelectorAll('div.font-claude-response, div.\\!font-user-message').forEach(function (el) {
      var isUser = el.classList.contains('!font-user-message');
      var txt = clean(el);
      if (txt) messages.push({ role: isUser ? 'user' : 'assistant', text: txt });
    });

  } else if (host.includes('chatgpt.com')) {
    // ChatGPT
    document.querySelectorAll('[data-message-author-role]').forEach(function (el) {
      messages.push({ role: el.getAttribute('data-message-author-role'), text: clean(el) });
    });

  } else if (host.includes('grok.com')) {
    // Grok (usar grok.com, no x.com)
    document.querySelectorAll('.message-bubble').forEach(function (el) {
      var parent = el.parentElement;
      var isUser = parent && parent.className.includes('items-end');
      var txt = clean(el);
      if (txt) messages.push({ role: isUser ? 'user' : 'assistant', text: txt });
    });

  } else if (host.includes('gemini.google.com')) {
    // Gemini
    document.querySelectorAll('user-query,model-response').forEach(function (el) {
      var isUser = el.tagName.toLowerCase() === 'user-query';
      var txt = cleanGemini(el);
      if (txt) messages.push({ role: isUser ? 'user' : 'assistant', text: txt });
    });

  } else {
    alert('Sitio no reconocido: ' + host + ':' + port);
    return;
  }

  if (!messages.length) {
    alert('No se encontraron mensajes. Puede que los selectores estén desactualizados.');
    return;
  }

  // Construcción del Markdown
  var title = document.title || 'conversacion';
  var date = new Date().toISOString().split('T')[0];
  var platform = isOpenWebUI ? 'Open WebUI' : host;

  var md = '# ' + title + '\n\n'
    + '**URL:** ' + location.href + '\n'
    + '**Capturado:** ' + date + '\n'
    + '**Plataforma:** ' + platform + '\n\n'
    + '---\n\n';

  messages.forEach(function (m) {
    md += '### ' + (m.role === 'user' ? '👤 Tú' : '🤖 IA') + '\n\n' + m.text + '\n\n---\n\n';
  });

  // Descarga del archivo
  var slug = title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60);
  var filename = date + '-' + slug + '.md';

  var blob = new Blob([md], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
})();
