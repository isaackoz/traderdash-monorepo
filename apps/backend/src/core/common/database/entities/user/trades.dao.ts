import { Injectable } from '@nestjs/common';
import { BaseDao } from '../base.dao';
import { AddTradeToDbData } from '@repo/shared-schemas';
import {
  tradeItemTable,
  tradesTable,
  userExchangeConnectionsTable,
} from '@repo/db';
import { and, eq } from 'drizzle-orm';
import { TAPIUserTradesGet } from '@repo/shared-types';
// import { TAPIUserTradesGet } from '@repo/shared-types';

@Injectable()
export class TradesDao extends BaseDao {
  async addNewTrade(userId: string, data: AddTradeToDbData): Promise<string> {
    // return the trade id when done
    return await this.db.transaction(async (tx) => {
      // First, get the user's exchange connection id to ensure they own it
      const userExchangeConnection = (
        await tx
          .select()
          .from(userExchangeConnectionsTable)
          .where(
            and(
              eq(
                userExchangeConnectionsTable.id,
                data.tradeData.userExchangeId,
              ),
              eq(userExchangeConnectionsTable.userId, userId),
            ),
          )
      )[0];

      if (!userExchangeConnection) {
        throw new Error('User does not own this exchange connection');
      }

      // Then save the trade to the tx
      const newTrade = (
        await tx
          .insert(tradesTable)
          .values({
            ...data.tradeData,
            lastSyncTimestamp: new Date().getTime(), // this should always be the current time. this will get updated when the user syncs data
          })
          .returning({ id: tradesTable.id })
      )[0];

      // for each trade item, add the trade id to it
      const tradeItemsToInsert = data.tradeItems.map(
        (item): typeof tradeItemTable.$inferInsert => {
          return {
            ...item,
            tradeId: newTrade.id,
          };
        },
      );

      // Finally, save all of the tradeItems
      await tx.insert(tradeItemTable).values(tradeItemsToInsert);

      // And finally return the string value for newTrade.id
      return newTrade.id;
    });
  }

  // async removeTrade(userId: string, tradeId: string): Promise<void> {
  //   noop();
  // }

  /**
   * Todo: add pagination
   */
  async getTrades(userId: string): Promise<TAPIUserTradesGet[]> {
    // Get all the user's trades
    // Todo: use sql builder instead of queries api
    const res = await this.db.query.userExchangeConnectionsTable.findMany({
      columns: {
        exchangeId: true,
      },
      with: {
        trades: {
          with: {
            tradeItems: true,
          },
        },
      },
      where: (exchangeConnection, { eq }) =>
        eq(exchangeConnection.userId, userId),
    });

    // remove any results that are empty (exchanges without any trades)
    const filtered = res
      .filter((item) => item.trades.length > 0)
      .flatMap(({ exchangeId, trades }) =>
        trades.map((trade) => ({ ...trade, exchangeId })),
      );
    console.log(filtered);
    return filtered;
  }
}
