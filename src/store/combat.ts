import * as _ from 'lodash';
import { makeAutoObservable, runInAction } from 'mobx';
import epAPI from '../api';

export interface Character {
  id: string
  name: string
  avatar?: string
}

export interface CombatToken {
  name: string
  initiative?: number
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

export interface WebSocketMsg {
  type?: string
}

export interface CombatMsg extends WebSocketMsg {
  action: object
  combat: Combat
}

export interface AddTokenResponse {
  token: CombatToken
  rank: number
}

export class CombatStore {
  combat?: Combat;

  loading = true;

  wsPing: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private async fetchCombat(combatId: string) {
    this.loading = true;
    const combat = await CombatStore.getCombat(combatId);
    runInAction(() => {
      this.combat = combat;
      this.loading = false;
    });
  }

  fetchCombatIfNeed(combatId: string) {
    this.fetchCombat(combatId);
  }

  async removeToken(token: CombatToken) {
    if (!this.combat) {
      return;
    }
    this.combat.order.order = this.combat.order.order.filter((item) => token !== item);

    await epAPI.delete(
      `/combats/${this.combat.id}/tokens/${token.name}`,
    ).catch((e) => {
      throw e;
    });
  }

  async addToken(token: CombatToken) {
    if (!this.combat) {
      return;
    }
    if (token.name in this.combat.tokens) {
      return;
    }
    const response = await epAPI.post(
      `/combats/${this.combat.id}/tokens`,
      {
        name: token.name,
        initiative: token.initiative,
      },
    ).catch((e) => {
      throw e;
    });
    const data = response.data as AddTokenResponse;
    runInAction(() => {
      if (!this.combat) {
        return;
      }
      this.combat.tokens[data.token.name] = data.token;
      this.combat.order.order.splice(data.rank, 0, data.token);
    });
  }

  async setCurrentToken(token: CombatToken) {
    if (!this.combat) {
      return;
    }
    this.combat.order.currentToken = token;
    await epAPI.put(
      `/combats/${this.combat.id}`,
      {
        action: 'set_current',
        currentToken: token.name,
      },
    ).catch((e) => {
      throw e;
    });
  }

  async onMessage(msg: CombatMsg) {
    if (msg.type === 'pong') {
      return;
    }
    this.combat = msg.combat;
  }

  async reorderToken(newOrder: Array<CombatToken>) {
    if (!this.combat) {
      return;
    }
    const currentOrderNames = this.combat.order.order.map((item) => item.name);
    const newOrderNames = newOrder.map((item) => item.name);
    if (_.isEqual(currentOrderNames, newOrderNames)) {
      return;
    }
    this.combat.order.order = newOrder;
    await epAPI.put(
      `/combats/${this.combat.id}`,
      {
        action: 'reorder',
        tokens: newOrderNames,
      },
    ).catch((e) => {
      throw e;
    });
  }

  async runCombat() {
    if (!this.combat) {
      return;
    }
    const response = await epAPI.put(
      `/combats/${this.combat.id}`,
      {
        action: 'run',
      },
    ).catch((e) => {
      throw e;
    });
    const combat = response.data as Combat;
    runInAction(() => {
      this.combat = combat;
    });
  }

  async endCombat() {
    if (!this.combat) {
      return;
    }
    const response = await epAPI.put(
      `/combats/${this.combat.id}`,
      {
        action: 'end',
      },
    ).catch((e) => {
      throw e;
    });
    const combat = response.data as Combat;
    runInAction(() => {
      this.combat = combat;
    });
  }

  async nextToken() {
    if (!this.combat) {
      return;
    }
    const response = await epAPI.put(
      `/combats/${this.combat.id}`,
      {
        action: 'next',
      },
    ).catch((e) => {
      throw e;
    });
    const combat = response.data as Combat;
    runInAction(() => {
      this.combat = combat;
    });
  }

  static async getCombat(combatId: string): Promise<Combat> {
    const response = await epAPI.get(
      `/combats/${combatId}`,
    ).catch((e) => {
      throw e;
    });
    return response.data as Combat;
  }

  setWsPing(ping: number | null) {
    if (!ping) {
      this.wsPing = ping;
      return;
    }
    this.wsPing = Math.ceil(ping / 2);
  }
}

export const combatStore = new CombatStore();
