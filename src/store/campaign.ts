import { Character } from './combat';
import { Member } from './me';

export interface Campaign {
  id: string
  roomId: string
  name: string
  description: string
  owner: Member
  state: string
  created: number
  updated: number
  characters?: Character[]
  relationship?: CampaignRelationship
}

export interface CampaignRelationship {
  isGm?: boolean
  isPlayer?: boolean
  usingCharacter?: Character
}
