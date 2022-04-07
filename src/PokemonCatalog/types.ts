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
  showDetails?: boolean;
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