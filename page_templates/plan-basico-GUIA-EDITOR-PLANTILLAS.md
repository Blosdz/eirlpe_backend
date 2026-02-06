# Guía: usar las plantillas Plan Básico en un editor de plantillas

Esta guía explica cómo integrar las plantillas **plan-basico-opcion-1** y **plan-basico-opcion-2** en un editor de plantillas (formulario básico que rellena la página).

---

## 1. Estructura de cada plantilla

Cada opción incluye tres archivos que deben servirse juntos:

| Archivo     | Uso |
|------------|-----|
| `index.html` | Contiene los marcadores `[MARCADOR]`. El editor reemplaza estos por los datos del usuario. |
| `styles.css` | No tiene marcadores. Copiar tal cual o servir desde una URL fija. |
| `script.js`  | Solo menú móvil. Copiar tal cual o servir desde una URL fija. |

Al publicar la página del usuario, el resultado debe ser: un `index.html` ya reemplazado + los mismos `styles.css` y `script.js` (por referencia o inline/incluidos).

---

## 2. Marcadores y reemplazo

Cada `[MARCADOR]` se sustituye por el valor guardado en el editor. Reemplazo recomendado: **todas las ocurrencias** del mismo marcador en el HTML.

### Lista de marcadores (común a ambas plantillas)

| Marcador | Descripción | Ejemplo |
|----------|-------------|---------|
| `[LOGO_EMPRESA]` | Nombre o logo de la empresa | Mi Negocio |
| `[TITULO_PRINCIPAL]` | Título grande del hero | Bienvenidos a Mi Negocio |
| `[SUBTITULO_DESCRIPTIVO]` | Subtítulo del hero | Soluciones a tu medida |
| `[TEXTO_BOTON_PRINCIPAL]` | Texto del botón principal | Contáctanos |
| `[TITULO_SECCION_SERVICIOS]` | Título de la sección Servicios | Nuestros Servicios |
| `[TITULO_SERVICIO_1]` | Título del servicio 1 | Asesoría |
| `[DESCRIPCION_SERVICIO_1]` | Descripción del servicio 1 | Te acompañamos en... |
| `[TITULO_SERVICIO_2]` | Título del servicio 2 | ... |
| `[DESCRIPCION_SERVICIO_2]` | Descripción del servicio 2 | ... |
| `[TITULO_SERVICIO_3]` | Título del servicio 3 | ... |
| `[DESCRIPCION_SERVICIO_3]` | Descripción del servicio 3 | ... |
| `[TITULO_SECCION_SOBRE_NOSOTROS]` | Título Sobre nosotros | Sobre Nosotros |
| `[DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1]` | Primer párrafo | Somos una empresa... |
| `[DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2]` | Segundo párrafo | Con más de 10 años... |
| `[EMAIL_CONTACTO]` | Email en el footer (contacto) | contacto@empresa.com |
| `[TELEFONO_CONTACTO]` | Teléfono en el footer | +51 999 888 777 |
| `[DIRECCION_CONTACTO]` | Dirección en el footer | Av. Principal 123 |
| `[TEXTO_FOOTER]` | Texto opcional del footer | Frase o eslogan |
| `[AÑO]` | Año del copyright | 2026 |
| `[NOMBRE_EMPRESA]` | Nombre en copyright | Mi Empresa |
| `[LOGO_WEBAPP]` | Branding de la plataforma | eirl.pe |
| `[ESTILO_FUENTE]` | Clase CSS de fuente (ver sección 3) | font-opcion-1 |
| `[ESTILO_COLOR]` | Clase CSS de color (ver sección 3) | color-opcion-1 |

### Solo en Opción 1

| Marcador | Descripción |
|----------|-------------|
| `[TEXTO_BOTON_SECUNDARIO]` | Texto del segundo botón del hero |
| `[DESCRIPCION_SERVICIOS]` | Párrafo introductorio de la sección Servicios |
| `[ICONO_1]`, `[ICONO_2]`, `[ICONO_3]` | Icono o emoji por servicio (ej. 🔧) |
| `[IMAGEN_SOBRE_NOSOTROS]` | URL o HTML de la imagen (o texto/placeholder) |

---

## 3. Estilo: fuente y color

Las clases se aplican en `<html class="[ESTILO_FUENTE] [ESTILO_COLOR]">`. El editor debe guardar y reemplazar con **un valor por marcador**.

### Estilo de fuente (2 opciones)

| Valor | Efecto en Opción 1 | Efecto en Opción 2 |
|-------|--------------------|--------------------|
| `font-opcion-1` | Sans-serif moderna (Segoe UI) | Serif clásica (Georgia + Arial) |
| `font-opcion-2` | Serif (Georgia) | Sans-serif (Segoe UI) |

### Esquema de color (3 opciones)

| Valor | Opción 1 | Opción 2 |
|-------|----------|----------|
| `color-opcion-1` | Azul | Verde |
| `color-opcion-2` | Verde | Azul |
| `color-opcion-3` | Oscuro/neutro (gris) | Oscuro/neutro (gris) |

Valores por defecto si el usuario no elige: `font-opcion-1` y `color-opcion-1`.

---

## 4. Implementación en el editor

### 4.1 Datos que guarda el editor

Guardar un objeto (o filas en BD) con una clave por marcador, por ejemplo:

```javascript
const datos = {
  ESTILO_FUENTE: 'font-opcion-1',
  ESTILO_COLOR: 'color-opcion-2',
  LOGO_EMPRESA: 'Mi Negocio',
  TITULO_PRINCIPAL: 'Bienvenidos',
  SUBTITULO_DESCRIPTIVO: 'Soluciones a tu medida',
  TEXTO_BOTON_PRINCIPAL: 'Contáctanos',
  TEXTO_BOTON_SECUNDARIO: 'Ver servicios',   // solo Opción 1
  TITULO_SECCION_SERVICIOS: 'Nuestros Servicios',
  DESCRIPCION_SERVICIOS: 'Lo que ofrecemos...',  // solo Opción 1
  TITULO_SERVICIO_1: 'Asesoría',
  DESCRIPCION_SERVICIO_1: '...',
  TITULO_SERVICIO_2: '...',
  DESCRIPCION_SERVICIO_2: '...',
  TITULO_SERVICIO_3: '...',
  DESCRIPCION_SERVICIO_3: '...',
  ICONO_1: '🔧', ICONO_2: '📋', ICONO_3: '✅',  // solo Opción 1
  TITULO_SECCION_SOBRE_NOSOTROS: 'Sobre Nosotros',
  DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1: '...',
  DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2: '...',
  IMAGEN_SOBRE_NOSOTROS: '<img src="..." alt="Nosotros">',  // solo Opción 1
  EMAIL_CONTACTO: 'contacto@empresa.com',
  TELEFONO_CONTACTO: '+51 999 888 777',
  DIRECCION_CONTACTO: 'Av. Principal 123, Lima',
  TEXTO_FOOTER: 'Tu éxito es nuestro compromiso',
  AÑO: new Date().getFullYear().toString(),
  NOMBRE_EMPRESA: 'Mi Empresa',
  LOGO_WEBAPP: 'eirl.pe'
};
```

### 4.2 Generar el HTML final

1. Cargar el `index.html` de la plantilla elegida (Opción 1 u Opción 2) como string.
2. Reemplazar cada marcador por el valor (escapar HTML si el valor viene de usuario para marcadores que no sean HTML intencional).
3. Servir o guardar el HTML resultante.

Ejemplo en JavaScript:

```javascript
function generarHTML(plantillaHTML, datos) {
  let html = plantillaHTML;
  for (const [marcador, valor] of Object.entries(datos)) {
    const valorSeguro = valor != null ? String(valor) : '';
    html = html.replaceAll(`[${marcador}]`, valorSeguro);
  }
  // Opcional: limpiar marcadores no reemplazados (quedarían visibles)
  html = html.replace(/\[[A-Z_0-9]+\]/g, '');
  return html;
}
```

### 4.3 Rutas de CSS y JS

En el HTML está:

- `href="styles.css"`
- `src="script.js"`

Opciones:

- **Misma carpeta**: al publicar, guardar `index.html`, `styles.css` y `script.js` en la misma ruta del subdominio (p. ej. `usuario.eirl.pe/`).
- **Rutas absolutas**: reemplazar en el HTML generado por URLs de tu CDN o dominio, por ejemplo `href="https://static.eirl.pe/plan-basico-1/styles.css"` y `src="https://static.eirl.pe/plan-basico-1/script.js"` según la plantilla.

---

## 5. Resumen para el editor

1. Ofrecer **dos plantillas**: Opción 1 (moderna, con botón secundario, descripción e iconos) y Opción 2 (clásica, más simple).
2. Formulario con **un campo por marcador** (o agrupados: servicios 1–3, sobre nosotros 1–2, etc.).
3. Dos selectores de estilo: **Estilo de letra** (2 opciones) → `[ESTILO_FUENTE]`, **Esquema de color** (3 opciones) → `[ESTILO_COLOR]`.
4. Al guardar/publicar: **generar HTML** reemplazando todos los marcadores y servir **el mismo CSS y JS** de la plantilla elegida.
5. **Valores por defecto**: `ESTILO_FUENTE = font-opcion-1`, `ESTILO_COLOR = color-opcion-1`, `AÑO = año actual`.

Con esto las plantillas quedan listas para usarse en un editor de plantillas basado en formulario.
