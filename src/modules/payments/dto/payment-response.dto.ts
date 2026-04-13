import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentResponse {
  @ApiProperty({
    example: 'pi_123',
    description: '(STRIPE, PAYPAL, etc) client secret for payment confirmation',
  })
  clientSecret: string;

  @ApiProperty({
    example: '216e4567-e89b-12d3-a456-426614174000',
    description: 'Payment ID in database',
  })
  paymentId: string;
}

export class PaymentResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    example: 'order123',
    description: 'Order ID',
  })
  orderId: string;

  @ApiProperty({
    example: 99.99,
    description: 'Payment amount',
  })
  amount: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  userId: string;

  @ApiProperty({
    example: 'PHP',
    description: 'Payment currency',
  })
  currency: string;

  @ApiProperty({
    example: 'COMPLETED',
    description: 'Payment status',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  status: string;

  @ApiProperty({
    example: 'STRIPE',
    description: 'Payment method',
    nullable: true,
  })
  paymentMethod: string | null;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Payment transaction ID',
    nullable: true,
  })
  transactionId: string | null;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the payment was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time when the payment was last updated',
  })
  updatedAt: Date;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Returned data',
    type: PaymentResponseDto,
  })
  data: PaymentResponseDto;

  @ApiProperty({
    example: 'Payment retrieved successfully',
    required: false,
  })
  message?: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: CreatePaymentIntentResponse,
  })
  data: CreatePaymentIntentResponse;

  @ApiProperty({
    example: 'Payment intent created successfully',
    required: false,
  })
  message?: string;
}
