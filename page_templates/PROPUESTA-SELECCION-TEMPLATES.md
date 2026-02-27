# Propuesta: Selección de templates con preview real

## Estado actual

- **Base de datos:** Existe la tabla `eirl.template` (id, template_json, folder_template, prices_stimation). El sistema de tenants usa `template_id` como **string** (nombre de carpeta, ej. `plan-basico-opcion-1`). No es obligatorio poblar la tabla para el selector: los templates se leen desde la carpeta `page_templates/`.
- **Templates en disco:** Hay 2 plantillas: `plan-basico-opcion-1` y `plan-basico-opcion-2`. Cada una tiene `index.html`, `styles.css`, `script.js` y `README.md`.
- **Frontend actual:** La página "Elige tu template" usa una lista **hardcodeada** (Minimal, Bold, Serene, etc.) con previews de **gradientes/colores**, no de las plantillas reales.
- **Backend:** `GET /api/tenant-page/templates` devuelve solo un array de nombres de carpeta (`string[]`).

## Objetivo

Que en la página de elección de template se muestren **solo los templates que existen en `page_templates/`**, con **preview real** (cómo se verá la página) y metadata (nombre, descripción, categoría).

## Propuesta de implementación

### 1. Metadata por template

En cada carpeta de template (ej. `plan-basico-opcion-1/`) se añade un archivo **`metadata.json`** con:

- **name:** Nombre visible (ej. "Plan Básico - Moderno").
- **description:** Texto corto para la tarjeta.
- **category:** Etiqueta (ej. "Profesional", "Clásico").

Si no existe `metadata.json`, se usa el **id** (nombre de carpeta) como nombre y categoría "General".

### 2. Backend

- **GET /api/tenant-page/templates** (o mantener y ampliar): devolver `{ templates: { id, name, description, category }[] }` leyendo cada carpeta y su `metadata.json`.
- **GET /api/tenant-page/preview/:templateId**: nuevo endpoint **público** (sin tenant) que:
  - Renderiza el `index.html` del template con los **valores por defecto** de los marcadores (`MARKER_DEFAULTS`).
  - Reescribe en el HTML las rutas de CSS/JS a `/api/tenant-page/assets/:templateId/styles.css` (y script.js).
  - Devuelve **HTML** (Content-Type: text/html).
- El frontend puede meter este HTML en un **iframe** (src = backend + `/api/tenant-page/preview/plan-basico-opcion-1`), de modo que el usuario vea un preview real de la plantilla (con estilos y estructura real).

### 3. Frontend

- Llamar a **GET /api/tenant-page/templates** para obtener la lista con metadata.
- En la página "Elige tu template":
  - Una tarjeta por template con: **nombre**, **categoría**, **descripción** y **preview**.
  - Preview: **iframe** con `src = VITE_API_URL + '/api/tenant-page/preview/' + template.id`. Así se muestra exactamente cómo quedará la página con los valores por defecto.
- Al "Continuar", se envía el **id** del template (nombre de carpeta) a la ruta de registro, como hasta ahora.

### 4. Cómo añadir un template nuevo (aparece solo en la lista)

Cada **carpeta** dentro de `page_templates/` que tenga al menos **`index.html`** se considera un template válido y **aparece automáticamente** en "Elige tu template".

1. Crear una carpeta nueva (ej. `mi-nuevo-template/`) con:
   - **`index.html`** (obligatorio; si falta, la carpeta no se lista).
   - `styles.css`, `script.js` y, si quieres, `README.md` (según `plan-basico-GUIA-EDITOR-PLANTILLAS.md`).
2. Opcional pero recomendado: **`metadata.json`** en esa misma carpeta:
   ```json
   {
     "name": "Nombre visible en el selector",
     "description": "Texto corto que aparece en la tarjeta.",
     "category": "Profesional"
   }
   ```
   Si no existe `metadata.json`, en la lista se usa el **nombre de la carpeta** como nombre y la categoría "General".
3. No hace falta tocar la BD ni reiniciar nada especial: el backend lee las carpetas al vuelo y el preview se genera con los valores por defecto de los marcadores.

### 5. Ventajas

- Preview **real** (mismo HTML/CSS que verá el usuario).
- Un solo origen de verdad: las carpetas en `page_templates/`.
- Añadir un template = nueva carpeta + `metadata.json`.
- La BD sigue disponible para precios o configuración extra sin cambiar el flujo del selector.
