import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindManyOptions,
  DeleteResult,
} from 'typeorm';

import * as https from 'https';

import { InjectRepository } from '@nestjs/typeorm';
import { Basic } from './basic.entity';

export interface BaseRepositoryInterface<T> {
  create(data: DeepPartial<T>): T;
  findOneById(id: number): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
}

@Injectable()
export class BasicService<T> {
  constructor(
    @InjectRepository(Basic)
    protected readonly repository: Repository<T>,
  ) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findAllByStatus(status: string): Promise<T[] | null> {
    const conditions = { status } as unknown as FindOptionsWhere<T>;
    return this.repository.find({ where: conditions });
  }

  async findOneByName(name: string): Promise<T | null> {
    const conditions = { name } as unknown as FindOptionsWhere<T>;
    return this.repository.findOne({ where: conditions });
  }
  async findOneByEmail(email: string): Promise<T | null> {
    const conditions = { email } as unknown as FindOptionsWhere<T>;
    return this.repository.findOne({ where: conditions });
  }

  async findOneByNum(num: number): Promise<T | null> {
    const conditions = { num } as unknown as FindOptionsWhere<T>;
    const result = await this.repository.findOne({ where: conditions });
    if (result === null) {
      return null;
    } else {
      return result as T;
    }
  }

  async findOneByUuid(uuid: string): Promise<T | null> {
    const conditions = { uuid } as unknown as FindOptionsWhere<T>;
    const result = await this.repository.findOne({ where: conditions });
    if (result !== null) {
      return result as T;
    } else {
      return null;
    }
  }
  async findOneById(id: number): Promise<T | null> {
    const conditions = { id } as unknown as FindOptionsWhere<T>;
    const result = await this.repository.findOne({ where: conditions });
    if (result !== null) {
      return result as T;
    } else {
      return null;
    }
  }

  async removeByUuid(uuid: string): Promise<T | null | string> {
    const entityToRemove = await this.findOneByUuid(uuid);
    if (!entityToRemove) {
      return null;
    }
    await this.repository.remove(entityToRemove);
    return uuid;
  }

  async updateByUuid(uuid: string, entity: Partial<T>): Promise<T> {
    await this.repository.update(uuid, entity as any);
    return this.findOneByUuid(uuid);
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async createSeveral(listCreateDto: DeepPartial<T[]>): Promise<T[]> {
    const entities = this.repository.create(listCreateDto);
    return this.repository.save(entities);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
  async deleteByUuid(uuid: string): Promise<DeleteResult> {
    return await this.repository.delete(uuid);
  }

  //-----------------------------------------------------------------
  isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  //------------------------------------------------------------------
  formatDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  formatDateUS(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  }
  //------------------------------------------------------------------
  getWeekNumber(dateString: string) {
    const date = new Date(dateString);
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    const remainderFromDivision = weekNumber % 4;
    switch (remainderFromDivision) {
      case 0:
        return 4;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
    }
  }
  //------------------------------------------------------------------
  getWeekDay(dateString: string) {
    const date = new Date(dateString);
    return date.getDay();
  }
  //------------------------------------------------------------------
  findMinByField<T>(array: T[], field: keyof T): T | null {
    try {
      if (array.length === 0) return null;

      return array.reduce((minItem, currentItem) => {
        return currentItem[field] < minItem[field] ? currentItem : minItem;
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //------------------------------------------------------------------
  cleanString(str: string) {
    str = str.replace(/\s\s+/g, ' ').trim().replace('<', '').replace('>', '');
    return str;
  }
  //------------------------------------------------------------------
  async getMainBotFromTelegramServer(): Promise<any> {
    return new Promise((resolve, reject) => {
      https
        .get(
          `https://api.telegram.org/bot${process.env.MAIN_TOKEN_BOT}/getMe`,
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              const mainBot: { ok: boolean; result: {} } = JSON.parse(data);
              resolve(mainBot);
            });
          },
        )
        .on('error', (e) => {
          reject(new Error(e.message));
        });
    });
  }
}
