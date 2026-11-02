export interface GameHistory {
  id: string;
  uid: string;
  gameType: 'ladder' | 'lunch' | 'office';
  inputData: any;
  resultData: any;
  createdAt: string;
}

export interface OfficeGameState {
  uid: string;
  stats: {
    salary: number;
    stress: number;
    health: number;
  };
  day: number;
  status: string;
  updatedAt: string;
}
