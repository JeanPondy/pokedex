/**
 * Represents a Pokémon with detailed statistics.
 */
export interface Pokemon {
  id: number; 
  name: string;
  image: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}
