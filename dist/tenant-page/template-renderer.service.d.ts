export declare const MARKER_DEFAULTS: Record<string, string>;
export interface MarkerMeta {
    key: string;
    label: string;
    group: string;
    defaultValue: string;
    hint?: string;
}
export declare const MARKERS_META: MarkerMeta[];
export declare class TemplateRendererService {
    private readonly logger;
    private readonly templatesRoot;
    private resolveTemplatesRoot;
    render(templateId: string, customization: Record<string, string> | undefined, assetBaseUrl: string): string;
    readAsset(templateId: string, filename: string): Buffer;
    templateExists(templateId: string): boolean;
    listTemplates(): string[];
    listTemplatesWithMeta(): {
        id: string;
        name: string;
        description: string;
        category: string;
    }[];
    renderPreview(templateId: string, assetBaseUrl: string): string;
    private resolveAssetPath;
}
