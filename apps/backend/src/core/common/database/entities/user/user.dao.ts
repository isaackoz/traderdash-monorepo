import { Injectable } from '@nestjs/common';
import { BaseDao } from '../base.dao';
import { eq, getTableColumns } from 'drizzle-orm';
import { usersTable, userExchangeConnectionsTable } from '@repo/db';
import { jsonAggBuildObject } from '../helpers/json-agg';

@Injectable()
export class UserDao extends BaseDao {
  async getMe(id: string) {
    const val = (
      await this.db
        .select({
          ...getTableColumns(usersTable),
          exchangeData: jsonAggBuildObject(
            { ...getTableColumns(userExchangeConnectionsTable) },
            { notNullColumn: 'id' },
          ),
        })
        .from(usersTable)
        .leftJoin(
          userExchangeConnectionsTable,
          eq(userExchangeConnectionsTable.userId, usersTable.id),
        )
        .where(eq(usersTable.id, id))
        .groupBy(usersTable.id)
    )[0];
    return val;
  }

  async createNew(id: string, email: string) {
    return await this.db.insert(usersTable).values({
      id: id,
      email: email,
    });
  }

  async checkIfUserExistsById(id: string): Promise<boolean> {
    const user = (
      await this.db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.id, id))
    )[0];

    return !!user;
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.db
      .select({})
      .from(usersTable)
      .where(eq(usersTable.username, username));
    if (user.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  async completeOnboarding(id: string, username: string): Promise<void> {
    await this.db
      .update(usersTable)
      .set({
        username: username,
        onBoardingComplete: true,
      })
      .where(eq(usersTable.id, id));
  }
  async isOnboardedComplete(id: string): Promise<boolean> {
    const res = (
      await this.db
        .select({ complete: usersTable.onBoardingComplete })
        .from(usersTable)
        .where(eq(usersTable.id, id))
    )[0];
    if (!res) {
      throw new Error('User not found');
    }

    if (res.complete) {
      return true;
    } else {
      return false;
    }
  }
}
