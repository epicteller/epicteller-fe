import { makeAutoObservable, runInAction } from 'mobx';
import epAPI from '../api';

export interface Character {
  id: string
  name: string
}

export interface CombatToken {
  name: string
  initiative: number
  character?: Character
}

export interface CombatOrder {
  order: Array<CombatToken>
  currentToken?: CombatToken
  roundCount: number
}

export enum CombatState {
  INITIATING = 'initiating',
  RUNNING = 'running',
  ENDED = 'ended',
}

export interface Combat {
  id: string
  state: CombatState
  isRemoved: boolean
  tokens: {[tokenName: string]: CombatToken}
  order: CombatOrder
  data: object
  startedAt: number
  endedAt?: number
  created: number
  updated: number
}

export class CombatStore {
  combat?: Combat;

  loading = true;

  constructor() {
    makeAutoObservable(this);
  }

  private async fetchCombat(combatId: string) {
    const combat = await CombatStore.getCombat(combatId);
    runInAction(() => {
      this.combat = combat;
      this.loading = false;
    });
  }

  fetchCombatIfNeed(combatId: string) {
    if (this.combat && combatId === this.combat.id && !this.loading) {
      return;
    }
    this.fetchCombat(combatId);
  }

  static async getCombat(combatId: string): Promise<Combat> {
    const response = await epAPI.get(
      `/combats/${combatId}`,
    ).catch((e) => {
      throw e;
    });
    return response.data as Combat;
  }
}

export const combatStore = new CombatStore();
