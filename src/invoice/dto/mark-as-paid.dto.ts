import { IsDate, IsOptional } from 'class-validator';

export class MarkAsPaidDto {
  @IsOptional()
  @IsDate()
  paidAt?: Date;
}
