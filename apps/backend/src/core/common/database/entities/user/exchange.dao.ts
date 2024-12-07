import { Injectable } from '@nestjs/common';
import { BaseDao } from '../base.dao';
import { userExchangeConnectionsTable } from '@repo/db';

import { AddUserExchangeData } from '@repo/shared-schemas';
import { decrypt, encrypt } from '@core/common/utils/key-encryption';
import { eq } from 'drizzle-orm';
import { TAPIUserExchangeGet } from '@repo/shared-types';

@Injectable()
export class ExchangeDao extends BaseDao {
  async addExchange(userId: string, data: AddUserExchangeData) {
    const key = this.configService.getOrThrow<string>('ENCRYPTION_KEY');

    await this.db.insert(userExchangeConnectionsTable).values({
      userId: userId,
      exchangeId: data.exchangeId,
      nickname: data.nickname,
      apiKeyHashed: data.apiKey && encrypt(data.apiKey, key),
      passwordHashed: data.password && encrypt(data.password, key),
      secretHashed: data.secret && encrypt(data.secret, key),
      uidHashed: data.uid && encrypt(data.uid, key),
    });
  }

  async getAllConnections(userId: string): Promise<TAPIUserExchangeGet[]> {
    const key = this.configService.getOrThrow<string>('ENCRYPTION_KEY');
    const results = await this.db
      .select()
      .from(userExchangeConnectionsTable)
      .where(eq(userExchangeConnectionsTable.userId, userId));

    // Decrypt each key
    return results.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      nickname: item.nickname,
      exchangeId: item.exchangeId,
      preferences: item.preferences,
      updatedAt: item.updatedAt,
      userId: item.userId,
      apiKey: item.apiKeyHashed && decrypt(item.apiKeyHashed, key),
      password: item.passwordHashed && decrypt(item.passwordHashed, key),
      secret: item.secretHashed && decrypt(item.secretHashed, key),
      uid: item.uidHashed && decrypt(item.uidHashed, key),
      proxyUrl: item.proxyUrl,
      noProxy: item.noProxy,
    }));
  }
}
