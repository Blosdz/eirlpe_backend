# Plantilla Plan Básico - Opción 1: Estilo Moderno Minimalista

## Características

- **Estilo**: Moderno y minimalista con gradientes
- **Colores**: Azul primario (#2563eb) con paleta limitada
- **Fuentes**: Sans-serif moderna (Segoe UI)
- **Layout**: Grid moderno con cards
- **JavaScript**: Mínimo (~2KB) - solo menú móvil y validación básica

## Estructura de Edición

Esta plantilla está diseñada para ser editada mediante un formulario básico. Los campos editables están marcados con `[MARCADORES]` que deben ser reemplazados por el contenido del usuario.

### Campos Editables:

#### Header
- `[LOGO_EMPRESA]` - Texto o HTML del logo

#### Hero Section
- `[TITULO_PRINCIPAL]` - Título principal grande
- `[SUBTITULO_DESCRIPTIVO]` - Subtítulo descriptivo
- `[TEXTO_BOTON_PRINCIPAL]` - Texto del botón principal
- `[TEXTO_BOTON_SECUNDARIO]` - Texto del botón secundario (opcional)

#### Servicios
- `[TITULO_SECCION_SERVICIOS]` - Título de la sección
- `[DESCRIPCION_SERVICIOS]` - Descripción general
- `[ICONO_1]`, `[ICONO_2]`, `[ICONO_3]` - Iconos o emojis
- `[TITULO_SERVICIO_1-3]` - Títulos de servicios
- `[DESCRIPCION_SERVICIO_1-3]` - Descripciones de servicios

#### Sobre Nosotros
- `[TITULO_SECCION_SOBRE_NOSOTROS]` - Título de la sección
- `[DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1-2]` - Párrafos de texto
- `[IMAGEN_SOBRE_NOSOTROS]` - URL o HTML de imagen

#### Footer (contacto)
- `[EMAIL_CONTACTO]`, `[TELEFONO_CONTACTO]`, `[DIRECCION_CONTACTO]` - Para que los visitantes contacten
- `[TEXTO_FOOTER]` - Texto adicional del footer
- `[AÑO]` - Año actual
- `[NOMBRE_EMPRESA]` - Nombre de la empresa
- `[LOGO_WEBAPP]` - Logo de la webapp (branding)

#### Estilo (personalización limitada)
- `[ESTILO_FUENTE]` - **Valores:** `font-opcion-1` (moderna sans-serif) | `font-opcion-2` (clásica serif)
- `[ESTILO_COLOR]` - **Valores:** `color-opcion-1` (azul) | `color-opcion-2` (verde) | `color-opcion-3` (oscuro/neutro)

## Personalización Limitada

### Estilos de fuente (2 opciones)
- **font-opcion-1**: Segoe UI, sans-serif (moderna)
- **font-opcion-2**: Georgia, serif (clásica)

### Esquemas de color (3 opciones)
- **color-opcion-1**: Azul (#2563eb)
- **color-opcion-2**: Verde (#059669)
- **color-opcion-3**: Oscuro/neutro (#475569)

### Variables CSS (se aplican según clase de color):
- Color primario: `--color-primary`
- Color secundario: `--color-secondary`
- Color de texto: `--color-text`
- Color de fondo: `--color-bg`

### Fuentes Disponibles:
- Fuente principal: Sans-serif moderna
- Fuente de títulos: Sans-serif moderna (misma familia)

## Tamaño de Archivos

- HTML: ~5KB
- CSS: ~8KB
- JavaScript: ~2KB
- **Total: ~15KB** (sin imágenes)

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive design (móvil, tablet, desktop)
- Sin dependencias externas
- Sin librerías JavaScript pesadas

## Notas para Desarrollo

1. Los marcadores `[XXX]` deben ser reemplazados dinámicamente desde el formulario básico
2. El formulario de contacto requiere backend para funcionar completamente
3. Las imágenes deben optimizarse antes de subirlas
4. El logo de la webapp debe incluirse en el footer según el branding requerido
