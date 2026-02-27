import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Definición de todos los marcadores con su valor por defecto.
// La clave es exactamente lo que aparece entre corchetes en el HTML: [CLAVE]
// ─────────────────────────────────────────────────────────────────────────────

export const MARKER_DEFAULTS: Record<string, string> = {
  // Estilos
  ESTILO_FUENTE: 'font-opcion-1',
  ESTILO_COLOR: 'color-opcion-1',
  // Header
  LOGO_EMPRESA: 'Mi Empresa',
  // Hero
  TITULO_PRINCIPAL: 'Bienvenidos a nuestra empresa',
  SUBTITULO_DESCRIPTIVO: 'Soluciones a tu medida',
  TEXTO_BOTON_PRINCIPAL: 'Contáctanos',
  TEXTO_BOTON_SECUNDARIO: 'Ver servicios',
  // Servicios
  TITULO_SECCION_SERVICIOS: 'Nuestros Servicios',
  DESCRIPCION_SERVICIOS: 'Ofrecemos soluciones de calidad para tu negocio.',
  ICONO_1: '🔧',
  TITULO_SERVICIO_1: 'Servicio 1',
  DESCRIPCION_SERVICIO_1: 'Descripción del primer servicio.',
  ICONO_2: '📋',
  TITULO_SERVICIO_2: 'Servicio 2',
  DESCRIPCION_SERVICIO_2: 'Descripción del segundo servicio.',
  ICONO_3: '✅',
  TITULO_SERVICIO_3: 'Servicio 3',
  DESCRIPCION_SERVICIO_3: 'Descripción del tercer servicio.',
  // Sobre nosotros
  TITULO_SECCION_SOBRE_NOSOTROS: 'Sobre Nosotros',
  DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1: 'Somos una empresa comprometida con la excelencia.',
  DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2: 'Con años de experiencia en el mercado.',
  IMAGEN_SOBRE_NOSOTROS: '🏢',
  // Contacto / Footer
  EMAIL_CONTACTO: 'contacto@empresa.com',
  TELEFONO_CONTACTO: '+51 999 888 777',
  DIRECCION_CONTACTO: 'Av. Principal 123, Lima, Perú',
  TEXTO_FOOTER: 'Tu éxito es nuestro compromiso',
  NOMBRE_EMPRESA: 'Mi Empresa',
  LOGO_WEBAPP: 'eirl.pe',
};

// Metadatos del marcador para el editor (etiqueta + grupo)
export interface MarkerMeta {
  key: string;
  label: string;
  group: string;
  defaultValue: string;
  hint?: string;
}

export const MARKERS_META: MarkerMeta[] = [
  // ── Estilo ────────────────────────────────────────────────────────────────
  { key: 'ESTILO_FUENTE',  label: 'Estilo de fuente',  group: 'Estilo', defaultValue: 'font-opcion-1',  hint: 'font-opcion-1 | font-opcion-2' },
  { key: 'ESTILO_COLOR',   label: 'Esquema de color',  group: 'Estilo', defaultValue: 'color-opcion-1', hint: 'color-opcion-1 | color-opcion-2 | color-opcion-3' },
  // ── Header ────────────────────────────────────────────────────────────────
  { key: 'LOGO_EMPRESA',   label: 'Nombre / Logo',     group: 'Header', defaultValue: 'Mi Empresa' },
  // ── Hero ──────────────────────────────────────────────────────────────────
  { key: 'TITULO_PRINCIPAL',       label: 'Título principal',   group: 'Hero', defaultValue: 'Bienvenidos a nuestra empresa' },
  { key: 'SUBTITULO_DESCRIPTIVO',  label: 'Subtítulo',          group: 'Hero', defaultValue: 'Soluciones a tu medida' },
  { key: 'TEXTO_BOTON_PRINCIPAL',  label: 'Botón principal',    group: 'Hero', defaultValue: 'Contáctanos' },
  { key: 'TEXTO_BOTON_SECUNDARIO', label: 'Botón secundario',   group: 'Hero', defaultValue: 'Ver servicios', hint: 'Solo opción 1' },
  // ── Servicios ─────────────────────────────────────────────────────────────
  { key: 'TITULO_SECCION_SERVICIOS', label: 'Título sección',        group: 'Servicios', defaultValue: 'Nuestros Servicios' },
  { key: 'DESCRIPCION_SERVICIOS',    label: 'Descripción sección',   group: 'Servicios', defaultValue: 'Ofrecemos soluciones de calidad.', hint: 'Solo opción 1' },
  { key: 'ICONO_1',             label: 'Ícono servicio 1',     group: 'Servicios', defaultValue: '🔧', hint: 'Solo opción 1' },
  { key: 'TITULO_SERVICIO_1',   label: 'Título servicio 1',    group: 'Servicios', defaultValue: 'Servicio 1' },
  { key: 'DESCRIPCION_SERVICIO_1', label: 'Descripción servicio 1', group: 'Servicios', defaultValue: 'Descripción del primer servicio.' },
  { key: 'ICONO_2',             label: 'Ícono servicio 2',     group: 'Servicios', defaultValue: '📋', hint: 'Solo opción 1' },
  { key: 'TITULO_SERVICIO_2',   label: 'Título servicio 2',    group: 'Servicios', defaultValue: 'Servicio 2' },
  { key: 'DESCRIPCION_SERVICIO_2', label: 'Descripción servicio 2', group: 'Servicios', defaultValue: 'Descripción del segundo servicio.' },
  { key: 'ICONO_3',             label: 'Ícono servicio 3',     group: 'Servicios', defaultValue: '✅', hint: 'Solo opción 1' },
  { key: 'TITULO_SERVICIO_3',   label: 'Título servicio 3',    group: 'Servicios', defaultValue: 'Servicio 3' },
  { key: 'DESCRIPCION_SERVICIO_3', label: 'Descripción servicio 3', group: 'Servicios', defaultValue: 'Descripción del tercer servicio.' },
  // ── Sobre Nosotros ────────────────────────────────────────────────────────
  { key: 'TITULO_SECCION_SOBRE_NOSOTROS',      label: 'Título sección',  group: 'Sobre Nosotros', defaultValue: 'Sobre Nosotros' },
  { key: 'DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1', label: 'Párrafo 1', group: 'Sobre Nosotros', defaultValue: 'Somos una empresa comprometida con la excelencia.' },
  { key: 'DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2', label: 'Párrafo 2', group: 'Sobre Nosotros', defaultValue: 'Con años de experiencia en el mercado.' },
  { key: 'IMAGEN_SOBRE_NOSOTROS', label: 'Imagen (URL o HTML)', group: 'Sobre Nosotros', defaultValue: '🏢', hint: 'Solo opción 1' },
  // ── Contacto / Footer ─────────────────────────────────────────────────────
  { key: 'EMAIL_CONTACTO',    label: 'Email de contacto',  group: 'Contacto', defaultValue: 'contacto@empresa.com' },
  { key: 'TELEFONO_CONTACTO', label: 'Teléfono',           group: 'Contacto', defaultValue: '+51 999 888 777' },
  { key: 'DIRECCION_CONTACTO',label: 'Dirección',          group: 'Contacto', defaultValue: 'Av. Principal 123, Lima, Perú' },
  { key: 'TEXTO_FOOTER',      label: 'Eslogan / Footer',   group: 'Contacto', defaultValue: 'Tu éxito es nuestro compromiso' },
  { key: 'NOMBRE_EMPRESA',    label: 'Nombre en copyright',group: 'Contacto', defaultValue: 'Mi Empresa' },
  { key: 'LOGO_WEBAPP',       label: 'Branding plataforma',group: 'Contacto', defaultValue: 'eirl.pe' },
];

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TemplateRendererService {
  private readonly logger = new Logger(TemplateRendererService.name);

  // Ruta base: page_templates junto a la raíz del backend (funciona desde eirlpe_backend o desde eirl.pe)
  private readonly templatesRoot = this.resolveTemplatesRoot();

  private resolveTemplatesRoot(): string {
    const fromCwd = path.join(process.cwd(), 'page_templates');
    if (fs.existsSync(fromCwd)) return fromCwd;
    const fromBackend = path.join(process.cwd(), 'eirlpe_backend', 'page_templates');
    if (fs.existsSync(fromBackend)) return fromBackend;
    // Relativo al módulo (dist/tenant-page o src/tenant-page)
    const fromModule = path.join(__dirname, '..', '..', 'page_templates');
    return fromModule;
  }

  /**
   * Renderiza el HTML del template con los valores del tenant.
   * @param templateId  Nombre de la carpeta, ej: 'plan-basico-opcion-1'
   * @param customization  Objeto con los valores de los marcadores (de tenant_config.customization)
   * @param assetBaseUrl  URL base para reescribir los paths de CSS/JS, ej: '/api/tenant-page/assets/plan-basico-opcion-1'
   */
  render(
    templateId: string,
    customization: Record<string, string> = {},
    assetBaseUrl: string,
  ): string {
    const htmlPath = this.resolveAssetPath(templateId, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');

    // Combinar defaults + customización del tenant (los del tenant tienen prioridad)
    const values: Record<string, string> = {
      ...MARKER_DEFAULTS,
      AÑO: String(new Date().getFullYear()),
      ...customization,
    };

    // Reemplazar cada [MARCADOR] con su valor
    for (const [key, value] of Object.entries(values)) {
      html = html.replaceAll(`[${key}]`, value ?? '');
    }

    // Limpiar marcadores que no fueron reemplazados (evita que aparezcan en la UI)
    html = html.replace(/\[[A-ZÁÉÍÓÚÑ_0-9]+\]/gi, '');

    // Reescribir rutas de assets relativos a la URL del endpoint de assets
    html = html.replace(/href="styles\.css"/g, `href="${assetBaseUrl}/styles.css"`);
    html = html.replace(/src="script\.js"/g,   `src="${assetBaseUrl}/script.js"`);

    return html;
  }

  /**
   * Lee un asset estático (styles.css, script.js) del template.
   */
  readAsset(templateId: string, filename: string): Buffer {
    // Sanitización: solo permitir nombres de archivo simples sin rutas relativas
    const safe = path.basename(filename);
    const filePath = this.resolveAssetPath(templateId, safe);
    return fs.readFileSync(filePath);
  }

  /**
   * Devuelve si un template existe en disco.
   */
  templateExists(templateId: string): boolean {
    try {
      const p = path.join(this.templatesRoot, templateId, 'index.html');
      return fs.existsSync(p);
    } catch {
      return false;
    }
  }

  /**
   * Lista los templates disponibles (nombres de carpeta).
   */
  listTemplates(): string[] {
    return fs
      .readdirSync(this.templatesRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  }

  /**
   * Lista los templates con metadata (name, description, category) desde metadata.json de cada carpeta.
   * Solo incluye carpetas que tienen index.html (template válido).
   */
  listTemplatesWithMeta(): { id: string; name: string; description: string; category: string }[] {
    const ids = this.listTemplates().filter((id) => this.templateExists(id));
    return ids.map((id) => {
      const metaPath = path.join(this.templatesRoot, id, 'metadata.json');
      let name = id;
      let description = '';
      let category = 'General';
      try {
        if (fs.existsSync(metaPath)) {
          const raw = fs.readFileSync(metaPath, 'utf-8');
          const meta = JSON.parse(raw) as { name?: string; description?: string; category?: string };
          if (meta.name) name = meta.name;
          if (meta.description) description = meta.description;
          if (meta.category) category = meta.category;
        }
      } catch {
        // mantener defaults
      }
      return { id, name, description, category };
    });
  }

  /**
   * Renderiza el HTML del template con valores por defecto (para preview en el selector).
   * Inyecta un estilo para escalar la página y que se vea completa en un iframe pequeño.
   */
  renderPreview(templateId: string, assetBaseUrl: string): string {
    let html = this.render(templateId, {}, assetBaseUrl);
    const scaleStyle =
      '<style id="eirlpe-preview-scale">html, body { transform: scale(0.28); transform-origin: 0 0; width: 357%; min-height: 357%; }</style>';
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${scaleStyle}</head>`);
    } else {
      html = scaleStyle + html;
    }
    return html;
  }

  // ── privado ────────────────────────────────────────────────────────────────

  private resolveAssetPath(templateId: string, filename: string): string {
    // Sanitizar templateId para evitar path traversal
    const safeTemplate = path.basename(templateId);
    const filePath = path.join(this.templatesRoot, safeTemplate, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Asset no encontrado: ${safeTemplate}/${filename}`);
    }

    return filePath;
  }
}
