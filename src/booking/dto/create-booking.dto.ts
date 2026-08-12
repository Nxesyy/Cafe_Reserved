import { IsInt, IsPositive, IsString, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsPositive()
  tableId!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'bookingDate harus berformat YYYY-MM-DD (contoh: 2026-08-20)',
  })
  bookingDate!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime harus berformat HH:mm (contoh: 18:00)',
  })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime harus berformat HH:mm (contoh: 20:00)',
  })
  endTime!: string;

  @IsInt()
  @IsPositive()
  guestcount!: number;
}
