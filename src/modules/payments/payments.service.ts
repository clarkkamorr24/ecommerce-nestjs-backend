import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe: Stripe.Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia',
    });
  }

  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{
    success: boolean;
    message: string;
    data: { clientSecret: string; paymentId: string };
  }> {
    const { orderId, amount, currency = 'PHP' } = createPaymentIntentDto;

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const exisitingPayment = await this.prisma.payment.findFirst({
      where: { orderId },
    });

    if (
      exisitingPayment &&
      exisitingPayment.status === PaymentStatus.COMPLETED
    ) {
      throw new BadRequestException('Payment already completed');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        orderId,
        userId,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod: 'STRIPE',
        transactionId: paymentIntent.id,
      },
    });

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret!,
        paymentId: payment.id,
      },
      message: 'Payment intent created successfully',
    };
  }

  async confirmPayment(
    userId: string,
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const { paymentIntentId, orderId } = confirmPaymentDto;

    const payment = await this.prisma.payment.findFirst({
      where: {
        orderId,
        userId,
        transactionId: paymentIntentId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed');
    }

    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not successful');
    }

    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED },
      }),

      this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      }),
    ]);

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order?.cartId) {
      await this.prisma.cart.update({
        where: { id: order.cartId },
        data: { checkedOut: true },
      });
    }

    return {
      success: true,
      data: this.map(updatedPayment),
      message: 'Payment confirmed successfully',
    };
  }

  async findAll(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message?: string;
  }> {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: payments.map((payment) => this.map(payment)),
      message: 'Payments retrieved successfully',
    };
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message?: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return {
      success: true,
      data: this.map(payment),
      message: 'Payment retrieved successfully',
    };
  }

  async findByOrder(
    orderId: string,
    userId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message?: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with order ID ${orderId} not found`);
    }

    return {
      success: true,
      data: this.map(payment),
      message: 'Payment retrieved successfully',
    };
  }

  private map(
    payment: Omit<PaymentResponseDto, 'amount'> & { amount: Prisma.Decimal },
  ): PaymentResponseDto {
    return {
      ...payment,
      amount: payment.amount.toNumber(),
    };
  }
}
