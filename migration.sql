-- Seed Templates for eirl.pe platform
-- Insert initial template options

-- Template 1: Professional Business
INSERT INTO eirl.template (template_json, folder_template, prices_stimation)
VALUES (
  '{
    "version": "1.0.0",
    "companyName": "Tu Empresa",
    "sections": {
      "jumbotron": {
        "enabled": true,
        "title": "Bienvenido a Tu Empresa",
        "subtitle": "Soluciones profesionales para tu negocio",
        "backgroundImage": "/templates/professional/hero-bg.jpg",
        "ctaButton": {
          "text": "Conocer Más",
          "link": "#about"
        }
      },
      "aboutUs": {
        "enabled": true,
        "title": "Sobre Nosotros",
        "description": "Somos una empresa comprometida con la excelencia y la innovación. Con años de experiencia en el mercado, ofrecemos soluciones personalizadas para cada cliente.",
        "image": "/templates/professional/about.jpg",
        "highlights": [
          "Más de 10 años de experiencia",
          "Equipo altamente calificado",
          "Compromiso con la calidad",
          "Atención personalizada"
        ]
      },
      "ourWork": {
        "enabled": true,
        "title": "Nuestros Proyectos",
        "description": "Conoce algunos de nuestros trabajos más destacados",
        "items": []
      },
      "contactUs": {
        "enabled": true,
        "title": "Contáctanos",
        "description": "¿Tienes alguna pregunta? Estamos aquí para ayudarte",
        "email": "contacto@tuempresa.com",
        "phone": "+51 999 999 999",
        "address": "Av. Principal 123, Lima, Perú",
        "socialMedia": {
          "facebook": "",
          "instagram": "",
          "linkedin": ""
        },
        "showForm": true
      }
    },
    "theme": {
      "primaryColor": "#2563EB",
      "secondaryColor": "#1E40AF",
      "fontFamily": "Inter, sans-serif",
      "logoUrl": ""
    }
  }',
  'professional-business',
  99.99
);

-- Template 2: Modern Portfolio
INSERT INTO eirl.template (template_json, folder_template, prices_stimation)
VALUES (
  '{
    "version": "1.0.0",
    "companyName": "Mi Portfolio",
    "sections": {
      "jumbotron": {
        "enabled": true,
        "title": "Diseño Creativo & Desarrollo",
        "subtitle": "Transformando ideas en realidad digital",
        "backgroundImage": "/templates/modern/hero-bg.jpg",
        "ctaButton": {
          "text": "Ver Proyectos",
          "link": "#work"
        }
      },
      "aboutUs": {
        "enabled": true,
        "title": "Acerca de Mí",
        "description": "Diseñador y desarrollador con pasión por crear experiencias digitales únicas y memorables.",
        "image": "/templates/modern/profile.jpg",
        "highlights": [
          "Diseño UI/UX",
          "Desarrollo Web",
          "Branding",
          "Diseño Gráfico"
        ]
      },
      "ourWork": {
        "enabled": true,
        "title": "Portfolio",
        "description": "Una selección de mis proyectos más recientes",
        "items": []
      },
      "contactUs": {
        "enabled": true,
        "title": "¿Trabajamos Juntos?",
        "description": "Estoy disponible para nuevos proyectos",
        "email": "hola@miportfolio.com",
        "phone": "+51 999 888 777",
        "address": "",
        "socialMedia": {
          "instagram": "",
          "linkedin": "",
          "twitter": ""
        },
        "showForm": true
      }
    },
    "theme": {
      "primaryColor": "#10B981",
      "secondaryColor": "#059669",
      "fontFamily": "Poppins, sans-serif",
      "logoUrl": ""
    }
  }',
  'modern-portfolio',
  79.99
);

-- Template 3: E-commerce Basic
INSERT INTO eirl.template (template_json, folder_template, prices_stimation)
VALUES (
  '{
    "version": "1.0.0",
    "companyName": "Tu Tienda Online",
    "sections": {
      "jumbotron": {
        "enabled": true,
        "title": "Las Mejores Ofertas del Mercado",
        "subtitle": "Productos de calidad al mejor precio",
        "backgroundImage": "/templates/ecommerce/hero-bg.jpg",
        "ctaButton": {
          "text": "Ver Catálogo",
          "link": "#products"
        }
      },
      "aboutUs": {
        "enabled": true,
        "title": "Nuestra Historia",
        "description": "Desde 2020, brindamos los mejores productos con envío a todo el Perú. Calidad garantizada y atención excepcional.",
        "image": "/templates/ecommerce/store.jpg",
        "highlights": [
          "Envío gratis en compras mayores a S/100",
          "Garantía de satisfacción",
          "Productos certificados",
          "Atención 24/7"
        ]
      },
      "ourWork": {
        "enabled": true,
        "title": "Productos Destacados",
        "description": "Descubre nuestros productos más populares",
        "items": []
      },
      "contactUs": {
        "enabled": true,
        "title": "Atención al Cliente",
        "description": "¿Necesitas ayuda? Contáctanos",
        "email": "ventas@tutienda.com",
        "phone": "+51 999 777 666",
        "address": "Jr. Comercio 456, Lima, Perú",
        "socialMedia": {
          "facebook": "",
          "instagram": "",
          "whatsapp": ""
        },
        "showForm": true
      }
    },
    "theme": {
      "primaryColor": "#F59E0B",
      "secondaryColor": "#D97706",
      "fontFamily": "Roboto, sans-serif",
      "logoUrl": ""
    }
  }',
  'ecommerce-basic',
  149.99
);

-- Verify inserted templates
SELECT id, folder_template, prices_stimation, created_at FROM eirl.template;