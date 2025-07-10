export class UpdateScheduleDTO {
  commonInfoUuid?: string;
  teamUuid?: string;
  dayOfWeek?: number;
  numberOfWeek?: number;
  startTime?: number;
  finishTime?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  excludeBedrooms?: number;
  excludeBathrooms?: number;
  status?: string;
  orderUuid?: string;
}
