"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
let PaymentsService = class PaymentsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    getConfig() {
        const publicKey = process.env.CULQI_PUBLIC_KEY || 'pk_test_xxx';
        return {
            culqiPublicKey: publicKey,
        };
    }
    async processPayment(paymentData) {
        try {
            const userResult = await this.dataSource.query('SELECT id, email FROM users WHERE id = $1', [paymentData.user_id]);
            if (userResult.length === 0) {
                throw new common_1.BadRequestException('Usuario no encontrado');
            }
            const user = userResult[0];
            const hostnameResult = await this.dataSource.query('SELECT id FROM hostnames WHERE hostname = $1', [paymentData.hostname]);
            if (hostnameResult.length === 0) {
                throw new common_1.BadRequestException('Hostname no encontrado');
            }
            const culqiCharge = await this.createCulqiCharge(paymentData.token_id, paymentData.amount, paymentData.currency, paymentData.description, user.email);
            if (!culqiCharge) {
                throw new common_1.BadRequestException('Error al procesar el cargo en Culqi');
            }
            const cobro = await this.dataSource.query(`INSERT INTO cobros (user_id, template_price_stimation, available)
         VALUES ($1, $2, $3) RETURNING *`, [paymentData.user_id, paymentData.amount / 100, true]);
            return {
                success: true,
                message: 'Pago procesado exitosamente',
                charge_id: culqiCharge.id,
                amount: paymentData.amount / 100,
                currency: paymentData.currency,
                hostname: paymentData.hostname,
            };
        }
        catch (error) {
            console.error('Error procesando pago:', error);
            throw new common_1.BadRequestException(error.message || 'Error al procesar el pago');
        }
    }
    async createCulqiCharge(tokenId, amount, currency, description, email) {
        try {
            const culqiApiKey = process.env.CULQI_API_KEY || 'sk_test_xxx';
            const culqiApiUrl = 'https://api.culqi.com/v2/charges';
            const response = await axios_1.default.post(culqiApiUrl, {
                amount: amount,
                currency_code: currency,
                source_id: tokenId,
                description: description,
                email: email,
                metadata: {
                    order_id: Date.now().toString(),
                },
            }, {
                headers: {
                    Authorization: `Bearer ${culqiApiKey}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error creating Culqi charge:', error.message);
            return null;
        }
    }
    async handleWebhook(webhookData) {
        try {
            const { event, data } = webhookData;
            switch (event) {
                case 'charge.completed':
                    console.log('Pago completado:', data);
                    break;
                case 'charge.failed':
                    console.log('Pago fallido:', data);
                    break;
                case 'charge.disputed':
                    console.log('Disputa iniciada:', data);
                    break;
            }
            return {
                success: true,
                message: 'Webhook procesado',
            };
        }
        catch (error) {
            console.error('Error processing webhook:', error);
            return {
                success: false,
                message: 'Error al procesar webhook',
            };
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map