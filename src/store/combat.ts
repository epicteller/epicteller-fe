import { makeAutoObservable } from 'mobx';
import epAPI from '../api';

interface UnloadedCombat {
  loading: true;
}

interface Character {
  Id: 
}

interface CombatToken {

}

interface CombatOrder {

}

interface Room {

}

interface Combat {
  id: string;

}

export type PossiblyLoadedCombat = UnloadedCombat | Combat;

export class CombatStore {
  combat?: Combat;
  loading = true;

  constructor() {
    makeAutoObservable(this);
  }
  
  async getCombat(combatId: string): Promise<Combat> {
    const response = await epAPI.get(
      `/combats/${combatId}`,
    ).catch((e) => {
      throw e;
    });
    return response.data as Combat;
  }

}

export const combatStore = new CombatStore();
