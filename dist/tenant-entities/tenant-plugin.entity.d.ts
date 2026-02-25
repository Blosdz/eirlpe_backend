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
    [key: string]: unknown;
}
export declare class TenantPlugin {
    id: number;
    pluginKey: string;
    displayName: string;
    isActive: boolean;
    config: PluginConfig;
    createdAt: Date;
    updatedAt: Date;
}
