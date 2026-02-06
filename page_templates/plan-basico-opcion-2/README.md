# Plantilla Plan Básico - Opción 2: Estilo Clásico Profesional

## Características

- **Estilo**: Clásico y profesional con tipografía serif
- **Colores**: Verde primario (#059669) con paleta limitada
- **Fuentes**: Serif clásica (Georgia) para texto, sans-serif para títulos
- **Layout**: Lista vertical con bordes destacados
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

#### Servicios
- `[TITULO_SECCION_SERVICIOS]` - Título de la sección
- `[TITULO_SERVICIO_1-3]` - Títulos de servicios
- `[DESCRIPCION_SERVICIO_1-3]` - Descripciones de servicios

#### Sobre Nosotros
- `[TITULO_SECCION_SOBRE_NOSOTROS]` - Título de la sección
- `[DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1-2]` - Párrafos de texto

#### Footer (contacto)
- `[EMAIL_CONTACTO]`, `[TELEFONO_CONTACTO]`, `[DIRECCION_CONTACTO]` - Para que los visitantes contacten
- `[TEXTO_FOOTER]` - Texto adicional del footer
- `[AÑO]` - Año actual
- `[NOMBRE_EMPRESA]` - Nombre de la empresa
- `[LOGO_WEBAPP]` - Logo de la webapp (branding)

#### Estilo (personalización limitada)
- `[ESTILO_FUENTE]` - **Valores:** `font-opcion-1` (clásica serif) | `font-opcion-2` (moderna sans-serif)
- `[ESTILO_COLOR]` - **Valores:** `color-opcion-1` (verde) | `color-opcion-2` (azul) | `color-opcion-3` (oscuro/neutro)

## Personalización Limitada

### Estilos de fuente (2 opciones)
- **font-opcion-1**: Georgia + Arial (clásica)
- **font-opcion-2**: Segoe UI, sans-serif (moderna)

### Esquemas de color (3 opciones)
- **color-opcion-1**: Verde (#059669)
- **color-opcion-2**: Azul (#2563eb)
- **color-opcion-3**: Oscuro/neutro (#475569)

### Variables CSS (se aplican según clase de color):
- Color primario: `--color-primary`
- Color secundario: `--color-secondary`
- Color de texto: `--color-text`
- Color de fondo: `--color-bg`

## Tamaño de Archivos

- HTML: ~4KB
- CSS: ~7KB
- JavaScript: ~2KB
- **Total: ~13KB** (sin imágenes)

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive design (móvil, tablet, desktop)
- Sin dependencias externas
- Sin librerías JavaScript pesadas

## Diferencias con Opción 1

1. **Estilo visual**: Más clásico y conservador vs moderno minimalista
2. **Tipografía**: Serif para texto vs sans-serif
3. **Layout servicios**: Lista vertical vs grid de cards
4. **Colores**: Verde vs azul
5. **Formulario**: Más completo con campo de teléfono adicional

## Notas para Desarrollo

1. Los marcadores `[XXX]` deben ser reemplazados dinámicamente desde el formulario básico
2. El formulario de contacto requiere backend para funcionar completamente
3. Las imágenes deben optimizarse antes de subirlas
4. El logo de la webapp debe incluirse en el footer según el branding requerido
5. Esta opción es ideal para empresas que buscan un look más tradicional y profesional
