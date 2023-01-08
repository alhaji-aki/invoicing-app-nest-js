import { IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export class CreateInvoiceLineDto {
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
