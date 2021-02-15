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
  qq?: string
}

export interface Me extends Member {
  email: string
  avatarOriginal: string
  externalInfo?: MemberExternalInfo
}

export class MeStore {
  fetched: boolean = false;

  me: Me | null = MeStore.getMeFromLocalStorage();

  constructor() {
    makeAutoObservable(this);
  }

  static getMeFromLocalStorage(): Me | null {
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

  async clearMe() {
    this.fetched = true;
    this.me = null;
    localStorage.removeItem('me');
  }

  async fetchMeIfNeeded() {
    if (this.fetched) {
      return;
    }
    this.fetched = true;
    const me = MeStore.getMeFromLocalStorage();
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
