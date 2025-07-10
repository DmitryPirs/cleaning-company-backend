export class UpdateWorkDTO {
  commonInfoUuid?: string;
  teamUuid?: string;
  typeClean?: number;
  houseCondition?: number;
  date?: string;
  startTime?: number;
  finishTime?: number;
  interiorWindows?: boolean;
  insideOven?: boolean;
  wipeBaseboards?: boolean;
  insideFridge?: boolean;
  insideCabinets?: boolean;
  pets?: boolean;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  excludeBedrooms?: number;
  excludeBathrooms?: number;
  status?: string;
  orderUuid?: string;
}
