export interface Pokemon {
  name?: string;
  sprites?: {
    front_default: string;
  };
  types?: {
    0: {
      type: string;
    };
    1: {
      type: string;
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
