export class CreateWorkDTO {
  readonly commonInfoUuid: string;
  readonly teamUuid: string;
  readonly typeClean: number;
  readonly houseCondition: number;
  readonly date: string;
  readonly startTime: number;
  readonly finishTime: number;
  readonly interiorWindows: boolean;
  readonly insideOven: boolean;
  readonly wipeBaseboards: boolean;
  readonly insideFridge: boolean;
  readonly insideCabinets: boolean;
  readonly pets: boolean;
  readonly price: number;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly excludeBedrooms: number;
  readonly excludeBathrooms: number;
  readonly status: string;
  readonly orderUuid: string;
}
