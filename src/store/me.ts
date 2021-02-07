import { makeAutoObservable, runInAction } from 'mobx';
import epAPI from '../api';

export interface Member {
  id: string
  name: string
  headline: string
  avatar: string
  created: number
}

export interface MemberExternalInfo {
  QQ?: string
}

export interface Me extends Member {
  email: string
  externalInfo?: MemberExternalInfo
}

export class MeStore {
  fetched: boolean = false;

  me: Me | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  static async getMeFromLocalStorage(): Promise<Me | null> {
    const meData = localStorage.getItem('me');
    if (!meData) {
      return null;
    }
    return JSON.parse(meData) ?? null;
  }

  static async getMeFromServer(): Promise<Me | null> {
    try {
      const response = await epAPI.get('/me');
      return response.data;
    } catch {
      return null;
    }
  }

  async refreshMe() {
    this.fetched = true;
    const me = await MeStore.getMeFromServer();
    runInAction(() => {
      this.me = me;
    });
    localStorage.setItem('me', JSON.stringify(me));
  }

  async fetchMeIfNeeded() {
    if (this.fetched) {
      return;
    }
    this.fetched = true;
    const me = await MeStore.getMeFromLocalStorage();
    if (me) {
      runInAction(() => {
        this.me = me;
      });
      return;
    }
    await this.refreshMe();
  }
}

export const me = new MeStore();
