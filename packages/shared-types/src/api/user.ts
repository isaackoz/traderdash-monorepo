export type TAPIUserMeGet = {
  id: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  onBoardingComplete: boolean;
  email: string;
};

export type TAPIUserCheckUsernamePOST = {
  isAvailable: boolean;
};
