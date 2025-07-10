export class CreateScheduleDTO {
  readonly commonInfoUuid: string;
  readonly teamUuid: string;
  readonly dayOfWeek: number;
  readonly numberOfWeek: number;
  readonly startTime: number;
  readonly finishTime: number;
  readonly price: number;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly excludeBedrooms: number;
  readonly excludeBathrooms: number;
  readonly status: string;
  readonly orderUuid: string;
}
