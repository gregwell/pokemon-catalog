import axios from "axios";
import { ApiResponse, Pokemon, SinglePokemonApiResponse } from "./types";

interface PreparePokemonsProps {
  setPokemons: React.Dispatch<React.SetStateAction<Pokemon[]>>;
}

export const preparePokemons = async ({
  setPokemons,
}: PreparePokemonsProps) => {
  const initialTwentyBasic: ApiResponse = await axios.get(
    "https://pokeapi.co/api/v2/pokemon"
  );

  const allOthersBasic: ApiResponse = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${
      initialTwentyBasic.data.count - 20
    }&offset=20`
  );

  const initialTwentyDetails: SinglePokemonApiResponse[] = (await Promise.all(
    initialTwentyBasic.data.results.map((result) =>
      axios.get<SinglePokemonApiResponse>(result.url)
    )
  )) as SinglePokemonApiResponse[];

  console.log(initialTwentyDetails.map((a) => a.data));

  setPokemons(initialTwentyDetails.map((a) => a.data));

  const allOthersDetails: SinglePokemonApiResponse[] = (await Promise.all(
    allOthersBasic.data.results.map((result) =>
      axios.get<SinglePokemonApiResponse>(result.url)
    )
  )) as SinglePokemonApiResponse[];

  setPokemons((prevState) => [
    ...prevState,
    ...allOthersDetails.map((a) => a.data),
  ]);
};
