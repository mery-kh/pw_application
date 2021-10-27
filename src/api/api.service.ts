import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CurrentUserService } from '../auth/auth.jwtDecode';
import { transactionEntity } from '../db/entities/transaction.entity';
import { userEntity } from '../db/entities';
import { apiDto } from './api.dto';

@Injectable()
export class ApiService {
  constructor(
    private readonly currentUser: CurrentUserService,
    @InjectRepository(transactionEntity)
    private readonly transactionRepo: Repository<transactionEntity>,
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
  ) {}

  public async getUserInfo(): Promise<{ data: userEntity; message: string }> {
    try {
      const user = await this.currentUser.getUserData();
      const data = await this.userRepo.findOne({
        select: ['id', 'username', 'email', 'balance'],
        where: {
          id: user.id,
        },
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (e) {
      throw new HttpException('User not found', 400);
    }
  }

  public async getUsersList(
    payload,
  ): Promise<{ data: userEntity[]; message: string }> {
    const isExist = await this.userRepo.find({
      where: {
        username: Like(`${payload.filter}%`),
      },
      select: ['id', 'username'],
    });
    if (isExist.length) {
      return {
        message: 'Success',
        data: isExist,
      };
    } else {
      throw new HttpException('No search string', 400);
    }
  }

  public async getUserTransactions(): Promise<{
    data: transactionEntity[];
    message: string;
  }> {
    const user = await this.currentUser.getUserData();
    const data = await this.transactionRepo.query(
      `SELECT id,"updatedAt" AS date, recipient AS username,  amount* -1 AS amount, sender_balance AS balance FROM transaction WHERE sender='${user.username}'
            UNION
            SELECT id, "updatedAt", sender, amount, recipient_balance FROM transaction WHERE recipient='${user.username}' ORDER BY date DESC ;`,
    );
    return {
      message: 'Success',
      data,
    };
  }

  public async createTransaction(payload: apiDto) {
    const user = await this.currentUser.getUserData();
    const isExist = await this.userRepo.findOne({
      where: {
        username: payload.name,
      },
    });
    const myData = await this.userRepo.findOne({
      where: {
        username: user.username,
      },
    });
    if (!isExist) {
      throw new HttpException('User not found', 400);
    }
    if (user.id === isExist.id) {
      throw new HttpException(
        'You can not replenish your account by yourself',
        400,
      );
    }
    if (myData.balance < payload.amount) {
      throw new HttpException('Balance exceeded', 400);
    }
    if (payload.amount <= 0) {
      throw new HttpException('Amount must be a positive number', 400);
    }
    const sum =
      parseInt(String(isExist.balance), 10) +
      parseInt(String(payload.amount), 10);
    const sub =
      parseInt(String(myData.balance), 10) -
      parseInt(String(payload.amount), 10);
    await this.userRepo.update({ username: user.username }, { balance: sub });
    const updatedUser = await this.userRepo.findOne({
      username: user.username,
    });
    await this.userRepo.update({ username: payload.name }, { balance: sum });
    const update = await this.userRepo.findOne({
      username: payload.name,
    });
    const transaction = await this.transactionRepo.save({
      sender: user.username,
      recipient: payload.name,
      amount: payload.amount,
      sender_balance: updatedUser.balance,
      recipient_balance: update.balance,
    });

    if (update) {
      return {
        trans_token: {
          id: isExist.id,
          date: transaction.createdAt.toUTCString(),
          username: transaction.recipient,
          amount: -transaction.amount,
          balance: updatedUser.balance,
        },
      };
    }
  }
}
