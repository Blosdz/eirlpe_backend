"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var TemplateRendererService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRendererService = exports.MARKERS_META = exports.MARKER_DEFAULTS = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
exports.MARKER_DEFAULTS = {
    ESTILO_FUENTE: 'font-opcion-1',
    ESTILO_COLOR: 'color-opcion-1',
    LOGO_EMPRESA: 'Mi Empresa',
    TITULO_PRINCIPAL: 'Bienvenidos a nuestra empresa',
    SUBTITULO_DESCRIPTIVO: 'Soluciones a tu medida',
    TEXTO_BOTON_PRINCIPAL: 'Contáctanos',
    TEXTO_BOTON_SECUNDARIO: 'Ver servicios',
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
    TITULO_SECCION_SOBRE_NOSOTROS: 'Sobre Nosotros',
    DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1: 'Somos una empresa comprometida con la excelencia.',
    DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2: 'Con años de experiencia en el mercado.',
    IMAGEN_SOBRE_NOSOTROS: '🏢',
    EMAIL_CONTACTO: 'contacto@empresa.com',
    TELEFONO_CONTACTO: '+51 999 888 777',
    DIRECCION_CONTACTO: 'Av. Principal 123, Lima, Perú',
    TEXTO_FOOTER: 'Tu éxito es nuestro compromiso',
    NOMBRE_EMPRESA: 'Mi Empresa',
    LOGO_WEBAPP: 'eirl.pe',
};
exports.MARKERS_META = [
    { key: 'ESTILO_FUENTE', label: 'Estilo de fuente', group: 'Estilo', defaultValue: 'font-opcion-1', hint: 'font-opcion-1 | font-opcion-2' },
    { key: 'ESTILO_COLOR', label: 'Esquema de color', group: 'Estilo', defaultValue: 'color-opcion-1', hint: 'color-opcion-1 | color-opcion-2 | color-opcion-3' },
    { key: 'LOGO_EMPRESA', label: 'Nombre / Logo', group: 'Header', defaultValue: 'Mi Empresa' },
    { key: 'TITULO_PRINCIPAL', label: 'Título principal', group: 'Hero', defaultValue: 'Bienvenidos a nuestra empresa' },
    { key: 'SUBTITULO_DESCRIPTIVO', label: 'Subtítulo', group: 'Hero', defaultValue: 'Soluciones a tu medida' },
    { key: 'TEXTO_BOTON_PRINCIPAL', label: 'Botón principal', group: 'Hero', defaultValue: 'Contáctanos' },
    { key: 'TEXTO_BOTON_SECUNDARIO', label: 'Botón secundario', group: 'Hero', defaultValue: 'Ver servicios', hint: 'Solo opción 1' },
    { key: 'TITULO_SECCION_SERVICIOS', label: 'Título sección', group: 'Servicios', defaultValue: 'Nuestros Servicios' },
    { key: 'DESCRIPCION_SERVICIOS', label: 'Descripción sección', group: 'Servicios', defaultValue: 'Ofrecemos soluciones de calidad.', hint: 'Solo opción 1' },
    { key: 'ICONO_1', label: 'Ícono servicio 1', group: 'Servicios', defaultValue: '🔧', hint: 'Solo opción 1' },
    { key: 'TITULO_SERVICIO_1', label: 'Título servicio 1', group: 'Servicios', defaultValue: 'Servicio 1' },
    { key: 'DESCRIPCION_SERVICIO_1', label: 'Descripción servicio 1', group: 'Servicios', defaultValue: 'Descripción del primer servicio.' },
    { key: 'ICONO_2', label: 'Ícono servicio 2', group: 'Servicios', defaultValue: '📋', hint: 'Solo opción 1' },
    { key: 'TITULO_SERVICIO_2', label: 'Título servicio 2', group: 'Servicios', defaultValue: 'Servicio 2' },
    { key: 'DESCRIPCION_SERVICIO_2', label: 'Descripción servicio 2', group: 'Servicios', defaultValue: 'Descripción del segundo servicio.' },
    { key: 'ICONO_3', label: 'Ícono servicio 3', group: 'Servicios', defaultValue: '✅', hint: 'Solo opción 1' },
    { key: 'TITULO_SERVICIO_3', label: 'Título servicio 3', group: 'Servicios', defaultValue: 'Servicio 3' },
    { key: 'DESCRIPCION_SERVICIO_3', label: 'Descripción servicio 3', group: 'Servicios', defaultValue: 'Descripción del tercer servicio.' },
    { key: 'TITULO_SECCION_SOBRE_NOSOTROS', label: 'Título sección', group: 'Sobre Nosotros', defaultValue: 'Sobre Nosotros' },
    { key: 'DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1', label: 'Párrafo 1', group: 'Sobre Nosotros', defaultValue: 'Somos una empresa comprometida con la excelencia.' },
    { key: 'DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2', label: 'Párrafo 2', group: 'Sobre Nosotros', defaultValue: 'Con años de experiencia en el mercado.' },
    { key: 'IMAGEN_SOBRE_NOSOTROS', label: 'Imagen (URL o HTML)', group: 'Sobre Nosotros', defaultValue: '🏢', hint: 'Solo opción 1' },
    { key: 'EMAIL_CONTACTO', label: 'Email de contacto', group: 'Contacto', defaultValue: 'contacto@empresa.com' },
    { key: 'TELEFONO_CONTACTO', label: 'Teléfono', group: 'Contacto', defaultValue: '+51 999 888 777' },
    { key: 'DIRECCION_CONTACTO', label: 'Dirección', group: 'Contacto', defaultValue: 'Av. Principal 123, Lima, Perú' },
    { key: 'TEXTO_FOOTER', label: 'Eslogan / Footer', group: 'Contacto', defaultValue: 'Tu éxito es nuestro compromiso' },
    { key: 'NOMBRE_EMPRESA', label: 'Nombre en copyright', group: 'Contacto', defaultValue: 'Mi Empresa' },
    { key: 'LOGO_WEBAPP', label: 'Branding plataforma', group: 'Contacto', defaultValue: 'eirl.pe' },
];
let TemplateRendererService = TemplateRendererService_1 = class TemplateRendererService {
    logger = new common_1.Logger(TemplateRendererService_1.name);
    templatesRoot = path.join(process.cwd(), 'page_templates');
    render(templateId, customization = {}, assetBaseUrl) {
        const htmlPath = this.resolveAssetPath(templateId, 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf-8');
        const values = {
            ...exports.MARKER_DEFAULTS,
            AÑO: String(new Date().getFullYear()),
            ...customization,
        };
        for (const [key, value] of Object.entries(values)) {
            html = html.replaceAll(`[${key}]`, value ?? '');
        }
        html = html.replace(/\[[A-ZÁÉÍÓÚÑ_0-9]+\]/gi, '');
        html = html.replace(/href="styles\.css"/g, `href="${assetBaseUrl}/styles.css"`);
        html = html.replace(/src="script\.js"/g, `src="${assetBaseUrl}/script.js"`);
        return html;
    }
    readAsset(templateId, filename) {
        const safe = path.basename(filename);
        const filePath = this.resolveAssetPath(templateId, safe);
        return fs.readFileSync(filePath);
    }
    templateExists(templateId) {
        try {
            const p = path.join(this.templatesRoot, templateId, 'index.html');
            return fs.existsSync(p);
        }
        catch {
            return false;
        }
    }
    listTemplates() {
        return fs
            .readdirSync(this.templatesRoot, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name);
    }
    resolveAssetPath(templateId, filename) {
        const safeTemplate = path.basename(templateId);
        const filePath = path.join(this.templatesRoot, safeTemplate, filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException(`Asset no encontrado: ${safeTemplate}/${filename}`);
        }
        return filePath;
    }
};
exports.TemplateRendererService = TemplateRendererService;
exports.TemplateRendererService = TemplateRendererService = TemplateRendererService_1 = __decorate([
    (0, common_1.Injectable)()
], TemplateRendererService);
//# sourceMappingURL=template-renderer.service.js.map