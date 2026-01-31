import { DataSource } from 'typeorm';
export declare class PaymentsService {
    private dataSource;
    constructor(dataSource: DataSource);
    getConfig(): {
        culqiPublicKey: string;
    };
    processPayment(paymentData: {
        token_id: string;
        hostname: string;
        user_id: number;
        amount: number;
        currency: string;
        description: string;
    }): Promise<{
        success: boolean;
        message: string;
        charge_id: any;
        amount: number;
        currency: string;
        hostname: string;
    }>;
    private createCulqiCharge;
    handleWebhook(webhookData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
