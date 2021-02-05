import { makeAutoObservable } from 'mobx';

export interface Me {
  id: number
}

export class MeStore {
  me?: Me

  constructor() {
    makeAutoObservable(this);
  }

  static async getMe(): Promise<Me | null> {
    return null;
  }
}

export const meStore = new MeStore();
