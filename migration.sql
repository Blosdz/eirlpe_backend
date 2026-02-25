-- Seed Templates for eirl.pe platform
-- Aligned with actual page_templates/ directories on disk

-- Limpiar registros anteriores si existen
DELETE FROM eirl.template;

-- Template 1: Plan Básico — Opción 1 (moderna con iconos)
INSERT INTO eirl.template (template_json, folder_template, prices_stimation)
VALUES (
  '{
    "name": "Plan Básico — Opción 1",
    "description": "Diseño moderno con sección de servicios con iconos, hero llamativo y formulario de contacto.",
    "preview_image": "/previews/plan-basico-opcion-1.png",
    "markers": [
      "ESTILO_FUENTE",
      "ESTILO_COLOR",
      "LOGO_EMPRESA",
      "TITULO_PRINCIPAL",
      "SUBTITULO_DESCRIPTIVO",
      "TEXTO_BOTON_PRINCIPAL",
      "TEXTO_BOTON_SECUNDARIO",
      "TITULO_SECCION_SERVICIOS",
      "DESCRIPCION_SERVICIOS",
      "ICONO_1",
      "TITULO_SERVICIO_1",
      "DESCRIPCION_SERVICIO_1",
      "ICONO_2",
      "TITULO_SERVICIO_2",
      "DESCRIPCION_SERVICIO_2",
      "ICONO_3",
      "TITULO_SERVICIO_3",
      "DESCRIPCION_SERVICIO_3",
      "TITULO_SECCION_SOBRE_NOSOTROS",
      "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1",
      "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2",
      "IMAGEN_SOBRE_NOSOTROS",
      "EMAIL_CONTACTO",
      "TELEFONO_CONTACTO",
      "DIRECCION_CONTACTO",
      "TEXTO_FOOTER",
      "NOMBRE_EMPRESA",
      "LOGO_WEBAPP"
    ]
  }',
  'plan-basico-opcion-1',
  49.99
);

-- Template 2: Plan Básico — Opción 2 (clásica, más simple)
INSERT INTO eirl.template (template_json, folder_template, prices_stimation)
VALUES (
  '{
    "name": "Plan Básico — Opción 2",
    "description": "Diseño clásico y elegante, más simple, enfocado en texto y contacto.",
    "preview_image": "/previews/plan-basico-opcion-2.png",
    "markers": [
      "ESTILO_FUENTE",
      "ESTILO_COLOR",
      "LOGO_EMPRESA",
      "TITULO_PRINCIPAL",
      "SUBTITULO_DESCRIPTIVO",
      "TEXTO_BOTON_PRINCIPAL",
      "TITULO_SERVICIO_1",
      "DESCRIPCION_SERVICIO_1",
      "TITULO_SERVICIO_2",
      "DESCRIPCION_SERVICIO_2",
      "TITULO_SERVICIO_3",
      "DESCRIPCION_SERVICIO_3",
      "TITULO_SECCION_SOBRE_NOSOTROS",
      "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_1",
      "DESCRIPCION_SOBRE_NOSOTROS_PARRAFO_2",
      "EMAIL_CONTACTO",
      "TELEFONO_CONTACTO",
      "DIRECCION_CONTACTO",
      "TEXTO_FOOTER",
      "NOMBRE_EMPRESA",
      "LOGO_WEBAPP"
    ]
  }',
  'plan-basico-opcion-2',
  49.99
);

-- Verificar templates insertados
SELECT id, folder_template, prices_stimation, created_at FROM eirl.template;
