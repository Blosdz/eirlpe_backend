import { Controller, Post, Get, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Get Culqi public key
   * GET /payments/config
   */
  @Get('config')
  async getConfig() {
    return this.paymentsService.getConfig();
  }

  /**
   * Process payment with Culqi token
   * POST /payments/process
   */
  @UseGuards(JwtAuthGuard)
  @Post('process')
  async processPayment(
    @Body()
    body: {
      token_id: string;
      hostname: string;
      user_id: number;
      amount: number;
      currency: string;
      description: string;
    },
  ) {
    if (!body.token_id || !body.hostname || !body.user_id) {
      throw new BadRequestException(
        'Token, hostname y user_id son requeridos',
      );
    }

    return this.paymentsService.processPayment(body);
  }

  /**
   * Get payment history for user
   * GET /payments/history/:userId
   */
  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    // Manejo de webhook de Culqi
    return this.paymentsService.handleWebhook(body);
  }
}
