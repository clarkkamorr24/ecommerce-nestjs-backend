import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PaymentsService } from './payments.service';
import {
  CreatePaymentIntentApiResponseDto,
  PaymentApiResponseDto,
} from './dto/payment-response.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // create payment intent
  @Post('create-intent')
  @ApiOperation({
    summary: 'Create a new payment intent',
    description: 'Create a payment intent for the order',
  })
  @ApiCreatedResponse({
    description: 'Payment intent created successfully',
    type: CreatePaymentIntentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or order not found',
  })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.createPaymentIntent(
      userId,
      createPaymentIntentDto,
    );
  }

  // confirm payment
  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm a payment',
    description: 'Confirm a payment intent for the order',
  })
  @ApiResponse({
    description: 'Payment confirmed successfully',
    type: PaymentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment not found or already completed',
  })
  async confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.confirmPayment(userId, confirmPaymentDto);
  }

  // get all payments
  @Get()
  @ApiOperation({
    summary: 'Get all payments',
    description: 'Get all payments for the current user',
  })
  @ApiOkResponse({
    description: 'Payments retrieved successfully',
    type: PaymentApiResponseDto,
  })
  async findAll(@GetUser('id') userId: string) {
    return await this.paymentsService.findAll(userId);
  }

  // get payment by id
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOperation({
    summary: 'Get a payment by ID',
    description: 'Get a specific payment by its ID',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return await this.paymentsService.findOne(id, userId);
  }

  // get payment by order id
  @Get('order/:orderId')
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'order123',
  })
  @ApiOperation({
    summary: 'Get payment by order ID',
    description: 'Get payment information by specific order',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findByOrder(
    @Param('orderId') orderId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.findByOrder(orderId, userId);
  }
}
