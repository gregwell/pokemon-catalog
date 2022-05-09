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

export interface State {
  pokemons: Pokemon[];
  count: number;
  offset: number;
  displayLimit: number;
  type: string;
  phrase: string;
  darkTheme: boolean;
}

export interface StateProps {
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
}