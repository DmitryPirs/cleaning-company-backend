import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn({ name: 'price_min_square' })
  minSquare: number;
  @Column({ name: 'price_base_price' })
  basePrice: number;
  @Column({ name: 'price_add_pets' })
  addPets: number;
  @Column({ name: 'price_condition_good_type_clean_deep' })
  conditionGoodTypeCleanDeep: number;
  @Column({ name: 'price_condition_good_type_clean_move' })
  conditionGoodTypeCleanMove: number;
  @Column({ name: 'price_condition_average_type_clean_deep' })
  conditionAverageTypeCleanDeep: number;
  @Column({ name: 'price_condition_average_type_clean_move' })
  conditionAverageTypeCleanMove: number;
  @Column({ name: 'price_condition_duty_type_clean_deep' })
  conditionDutyTypeCleanDeep: number;
  @Column({ name: 'price_condition_duty_type_clean_move' })
  conditionDutyTypeCleanMove: number;
  @Column({ name: 'price_time_good_condition_standard_cleaning' })
  timeGoodConditionStandardCleaning: number;
  @Column({ name: 'price_time_good_condition_deep_cleaning' })
  timeGoodConditionDeepCleaning: number;
  @Column({ name: 'price_time_good_condition_move_out_cleaning' })
  timeGoodConditionMoveOutCleaning: number;
  @Column({ name: 'price_time_average_condition_deep_cleaning' })
  timeAverageConditionDeepCleaning: number;
  @Column({ name: 'price_time_average_condition_move_out_cleaning' })
  timeAverageConditionMoveOutCleaning: number;
  @Column({ name: 'price_time_heavy_duty_condition_deep_cleaning' })
  timeHeavyDutyConditionDeepCleaning: number;
  @Column({ name: 'price_time_heavy_duty_condition_move_out_cleaning' })
  timeHeavyDutyConditionMoveOutCleaning: number;
}
