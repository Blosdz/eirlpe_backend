import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  constructor(private dataSource: DataSource) {}

  /**
   * Obtener configuración de Culqi
   */
  getConfig() {
    const publicKey = process.env.CULQI_PUBLIC_KEY || 'pk_test_xxx';
    return {
      culqiPublicKey: publicKey,
    };
  }

  /**
   * Procesar pago con token de Culqi
   */
  async processPayment(paymentData: {
    token_id: string;
    hostname: string;
    user_id: number;
    amount: number;
    currency: string;
    description: string;
  }) {
    try {
      // Validar que el usuario existe
      const userResult = await this.dataSource.query(
        'SELECT id, email FROM users WHERE id = $1',
        [paymentData.user_id],
      );

      if (userResult.length === 0) {
        throw new BadRequestException('Usuario no encontrado');
      }

      const user = userResult[0];

      // Validar que el hostname existe
      const hostnameResult = await this.dataSource.query(
        'SELECT id FROM hostnames WHERE hostname = $1',
        [paymentData.hostname],
      );

      if (hostnameResult.length === 0) {
        throw new BadRequestException('Hostname no encontrado');
      }

      // Crear cargo con Culqi API
      const culqiCharge = await this.createCulqiCharge(
        paymentData.token_id,
        paymentData.amount,
        paymentData.currency,
        paymentData.description,
        user.email,
      );

      if (!culqiCharge) {
        throw new BadRequestException('Error al procesar el cargo en Culqi');
      }

      // Registrar la transacción en la base de datos
      const cobro = await this.dataSource.query(
        `INSERT INTO cobros (user_id, template_price_stimation, available)
         VALUES ($1, $2, $3) RETURNING *`,
        [paymentData.user_id, paymentData.amount / 100, true],
      );

      return {
        success: true,
        message: 'Pago procesado exitosamente',
        charge_id: culqiCharge.id,
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        hostname: paymentData.hostname,
      };
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw new BadRequestException(
        error.message || 'Error al procesar el pago',
      );
    }
  }

  /**
   * Crear cargo con la API de Culqi
   */
  private async createCulqiCharge(
    tokenId: string,
    amount: number,
    currency: string,
    description: string,
    email: string,
  ) {
    try {
      // Usar la API de Culqi para crear un cargo
      // NOTA: Necesitas configurar tu API key de Culqi en variables de entorno
      const culqiApiKey = process.env.CULQI_API_KEY || 'sk_test_xxx';
      const culqiApiUrl = 'https://api.culqi.com/v2/charges';

      const response = await axios.post(
        culqiApiUrl,
        {
          amount: amount, // En centavos
          currency_code: currency,
          source_id: tokenId, // Token ID generado en el frontend
          description: description,
          email: email,
          metadata: {
            order_id: Date.now().toString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${culqiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Culqi charge:', error.message);
      return null;
    }
  }

  /**
   * Manejar webhook de Culqi
   */
  async handleWebhook(webhookData: any) {
    try {
      // Procesar el webhook según el evento
      const { event, data } = webhookData;

      switch (event) {
        case 'charge.completed':
          // Pago completado
          console.log('Pago completado:', data);
          break;
        case 'charge.failed':
          // Pago fallido
          console.log('Pago fallido:', data);
          break;
        case 'charge.disputed':
          // Disputa de pago
          console.log('Disputa iniciada:', data);
          break;
      }

      return {
        success: true,
        message: 'Webhook procesado',
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      return {
        success: false,
        message: 'Error al procesar webhook',
      };
    }
  }
}
