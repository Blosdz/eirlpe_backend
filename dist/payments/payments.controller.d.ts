import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getConfig(): Promise<{
        culqiPublicKey: string;
    }>;
    processPayment(body: {
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
    handleWebhook(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
