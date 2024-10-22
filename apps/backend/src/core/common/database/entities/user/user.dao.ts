import { Injectable } from '@nestjs/common';
import { BaseDao } from '../base.dao';
import { users } from './user.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserDao extends BaseDao {
  async getMe(id: string) {
    return (await this.db.select().from(users).where(eq(users.id, id)))[0];
  }

  async createNew(id: string, email: string) {
    return await this.db.insert(users).values({
      id: id,
      email: email,
    });
  }

  async checkIfUserExistsById(id: string): Promise<boolean> {
    const user = (
      await this.db.select({ id: users.id }).from(users).where(eq(users.id, id))
    )[0];

    return !!user;
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const user = await this.db
      .select({})
      .from(users)
      .where(eq(users.username, username));
    if (user.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  async completeOnboarding(id: string, username: string): Promise<void> {
    await this.db
      .update(users)
      .set({
        username: username,
        onBoardingComplete: true,
      })
      .where(eq(users.id, id));
  }
  async isOnboardedComplete(id: string): Promise<boolean> {
    const res = (
      await this.db
        .select({ complete: users.onBoardingComplete })
        .from(users)
        .where(eq(users.id, id))
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
