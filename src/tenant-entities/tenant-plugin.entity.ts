import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Estructura esperada en la columna `config` (JSONB):
 *
 * {
 *   "version": "1.0",
 *   "ai_chatbot": {
 *     "enabled": true,
 *     "provider": "openai",           // "openai" | "anthropic" | "gemini"
 *     "model": "gpt-4o-mini",
 *     "api_key": "sk-...",            // Cifrar en producción (ej. con AES-256)
 *     "system_prompt": "Eres un asistente de <empresa>...",
 *     "temperature": 0.7,
 *     "max_tokens": 500,
 *     "streaming": false
 *   },
 *   "langchain": {
 *     "enabled": false,
 *     "chain_type": "conversation",   // "qa" | "summary" | "conversation"
 *     "memory_type": "buffer",        // "buffer" | "summary" | "vector"
 *     "vector_store": {
 *       "provider": "pinecone",
 *       "index": "tenant-index",
 *       "api_key": "..."
 *     },
 *     "tools": ["web_search", "calculator"]
 *   },
 *   "whatsapp": {
 *     "enabled": false,
 *     "provider": "twilio",           // "twilio" | "meta_cloud_api"
 *     "account_sid": "...",
 *     "auth_token": "...",
 *     "phone_number": "+51999..."
 *   },
 *   "email": {
 *     "enabled": false,
 *     "provider": "resend",           // "resend" | "sendgrid" | "smtp"
 *     "api_key": "...",
 *     "from_address": "hola@tuempresa.com"
 *   }
 * }
 */

export type PluginProvider = 'openai' | 'anthropic' | 'gemini';

export interface AiChatbotConfig {
  enabled: boolean;
  provider: PluginProvider;
  model: string;
  api_key: string;
  system_prompt: string;
  temperature?: number;
  max_tokens?: number;
  streaming?: boolean;
}

export interface LangchainConfig {
  enabled: boolean;
  chain_type: 'qa' | 'summary' | 'conversation';
  memory_type: 'buffer' | 'summary' | 'vector';
  vector_store?: {
    provider: string;
    index: string;
    api_key: string;
  };
  tools?: string[];
}

export interface PluginConfig {
  version: string;
  ai_chatbot?: AiChatbotConfig;
  langchain?: LangchainConfig;
  whatsapp?: Record<string, unknown>;
  email?: Record<string, unknown>;
  [key: string]: unknown; // extensible para futuros plugins
}

@Entity('tenant_plugins')
export class TenantPlugin {
  @PrimaryGeneratedColumn()
  id: number;

  // Identificador del plugin: 'ai_chatbot', 'langchain', 'whatsapp', etc.
  @Column({ type: 'varchar', length: 100, unique: true, name: 'plugin_key' })
  pluginKey: string;

  // Nombre descriptivo del plugin
  @Column({ type: 'varchar', length: 255, name: 'display_name' })
  displayName: string;

  @Column({ type: 'boolean', default: false, name: 'is_active' })
  isActive: boolean;

  // JSONB: toda la configuración, credenciales y prompts del plugin
  @Column({ type: 'jsonb', default: '{}', name: 'config' })
  config: PluginConfig;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
