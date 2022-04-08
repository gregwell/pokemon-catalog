export interface Pokemon {
  name?: string;
  sprites?: {
    front_default: string;
  };
  types?: {
    0: {
      type: {
        name: string;
      };
    };
    1?: {
      type: {
        name: string;
      };
    };
  };
  weight?: number;
  height?: number;
}

export interface PokemonBasicInfo {
  name: string;
  url: string;
}

export interface ApiResponseData {
  count: number;
  results: PokemonBasicInfo[];
}

export interface ApiResponse {
  data: ApiResponseData;
}

export interface SinglePokemonApiResponse {
  data: Pokemon;
}

export enum FetchType {
  INITIAL,
  MORE,
  ALL,
}

export interface PokemonData {
  pokemons: Pokemon[];
  count: number;
  offset: number;
  displayLimit: number;
}

export interface Input {
  type: string | null;
  phrase: string | null;
}
