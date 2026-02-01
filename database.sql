-- Create schema
CREATE SCHEMA IF NOT EXISTS eirl;


-- Hostnames table
CREATE TABLE hostnames (
  id SERIAL PRIMARY KEY,
  hostname VARCHAR(255) NOT NULL UNIQUE,
  -- tabla depende de config mantener en comentario
  -- template_user_personalization INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- template se queda con config
-- Template table
-- CREATE TABLE template (
--   id SERIAL PRIMARY KEY,
--   template_json TEXT NOT NULL,
--   folder_template VARCHAR(500),
--   prices_stimation DECIMAL(10, 2),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- tabla config mantener en comentario
-- Template User Personalization table
-- CREATE TABLE template_user_personalization (
--   id SERIAL PRIMARY KEY,
--   hostname_id INT NOT NULL,
--   user_id INT NOT NULL,
--   template_id INT NOT NULL,
--   template_json_personalization TEXT,
--   cobros_available BOOLEAN DEFAULT TRUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT fk_template_user_hostnames FOREIGN KEY (hostname_id) REFERENCES hostnames(id) ON DELETE CASCADE,
--   CONSTRAINT fk_template_user_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--   CONSTRAINT fk_template_user_template FOREIGN KEY (template_id) REFERENCES template(id) ON DELETE CASCADE,
--   CONSTRAINT unique_user_template UNIQUE (hostname_id, user_id, template_id)
-- );

-- User Profile table
CREATE TABLE user_profile (
  id SERIAL PRIMARY KEY,
  users_id INT NOT NULL,
  document VARCHAR(100),
  phone VARCHAR(20),
  company_name VARCHAR(255),
  address VARCHAR(500),
  -- obligatorio 
  ruc_company VARCHAR(100) NOT NULL,
  hostname_id INT NOT NULL,
  template_user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_profile_users FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_profile_hostnames FOREIGN KEY (hostname_id) REFERENCES hostnames(id) ON DELETE CASCADE,
  -- CONSTRAINT fk_user_profile_template_user FOREIGN KEY (template_user_id) REFERENCES template_user_personalization(id) ON DELETE SET NULL,
  CONSTRAINT unique_user_hostname UNIQUE (users_id, hostname_id)
);

-- mas que cobros se cambia de nombre a disponibilidad 
-- se hace la peticion si esta disponible el usuario para ver la plantilla
-- CREATE TABLE cobros (
--   id SERIAL PRIMARY KEY,
--   user_id INT NOT NULL,
--   available BOOLEAN DEFAULT TRUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT fk_cobros_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

CREATE TABLE available(
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  -- config id si es necesario desarrollo pendiente 
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_available_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_hostnames_hostname ON hostnames(hostname);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profile_users_id ON user_profile(users_id);
CREATE INDEX idx_user_profile_hostname_id ON user_profile(hostname_id);
-- CREATE INDEX idx_template_user_hostname ON template_user_personalization(hostname_id);
-- CREATE INDEX idx_template_user_users ON template_user_personalization(user_id);
-- CREATE INDEX idx_template_user_template ON template_user_personalization(template_id);
-- CREATE INDEX idx_cobros_user_id ON cobros(user_id);
CREATE INDEX idx_available_user_id ON available(user_id);
