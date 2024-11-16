import type { ExchangeConnectionSelect } from "@repo/db";

export type TAPIUserMeGet = {
  id: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  onBoardingComplete: boolean;
  email: string;
  exchangeData: TAPIUserExchangeData[];
};

export type TAPIUserCheckUsernamePOST = {
  isAvailable: boolean;
};

export type TAPICompleteOnboardingPOST =
  | {
      success: true;
      message?: null;
    }
  | {
      success: false;
      message: string;
    };

export type TAPIUserExchangeData = ExchangeConnectionSelect;
