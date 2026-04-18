# Chat Export Bookmarklet

Un bookmarklet para exportar conversaciones de los principales LLMs a formato Markdown con un solo clic.

## Plataformas soportadas

### `bookmarklet.js` — Exportador principal
* Claude (claude.ai)
* ChatGPT (chatgpt.com)
* Gemini (gemini.google.com)
* Grok (grok.com)
* Open WebUI (instancias locales en localhost:8080 o 192.168.x.x:8080)

### `grok-x.js` — Exportador específico para Grok en X
* Grok integrado en X/Twitter (x.com/i/grok)

> **¿Por qué dos bookmarklets?** Grok dentro de X vive en un entorno técnico completamente distinto a `grok.com`. Usa clases CSS internas de X (`r-imh66m`, `r-1kt6imw`) en lugar de selectores estables, y requiere auto-scroll para cargar el histórico completo. Por eso se mantiene como herramienta separada.

## Características

- Exporta la conversación completa distinguiendo mensajes del usuario y del modelo
- Nombre de archivo automático en formato `YYYYMMDD-titulo-conversacion.md`
- Compatible con artículos de pago (corre en el contexto de tu navegador)
- Funciona en Brave, Firefox y Chrome
- Sin dependencias externas, sin instalación, sin permisos especiales

## Instalación

1. Copia el código del archivo [`bookmarklet.js`](bookmarklet.js)
2. Crea un nuevo marcador en tu navegador
3. En el campo **Nombre** escribe: `💬 Exportar Chat`
4. En el campo **URL** pega el código copiado
5. Guarda el marcador

## Uso

Entra en cualquier conversación de las plataformas soportadas y haz clic en el marcador. El archivo `.md` se descargará automáticamente.

## Formato de salida

```markdown
# Título de la conversación

**URL:** https://...
**Capturado:** 2026-03-17
**Plataforma:** claude.ai

---

### 👤 Tú

Mensaje del usuario...

---

### 🤖 IA

Respuesta del modelo...

---
```

## Notas

- Los selectores CSS dependen de la estructura HTML de cada plataforma. Si una plataforma actualiza su interfaz, el bookmarklet puede dejar de funcionar en ese sitio. Se irán publicando actualizaciones en este repositorio.
- Para Grok, usar siempre **grok.com** y no x.com.
- Para Open WebUI, se detecta automáticamente si la instancia corre en el puerto 8080.
- Para Grok en X (x.com/i/grok), usa **`grok-x.js`** en lugar del bookmarklet principal.
- Los selectores de `grok-x.js` dependen de clases CSS internas de X, que pueden cambiar con actualizaciones de su frontend. Si deja de funcionar, abre una issue.
  
## Contribuciones

Si el bookmarklet deja de funcionar en alguna plataforma o quieres añadir soporte para otras, abre un issue o envía un pull request.

## Licencia

MIT
