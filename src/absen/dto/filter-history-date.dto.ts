import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class FilterHistoryDateDto {
  @Type(() => Date)
  day: Date;
}
