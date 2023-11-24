import { useEffect, useState } from 'react';
import PokemonInfo from './PokemonInfo';
import Status from './Status';
import {
  getPokemonData,
  getPokemonSpecies,
  getEvolvesDatas,
} from '@/lib/poketApi';
import { PokemonType, Stat } from '@/lib/type';
import PokemonImg from './PokemonImg';
import { useParams } from 'react-router-dom';
import { FORM_NAMES } from '@/lib/pokemonFormNames';
import Comments from '@/components/comment/Comments';
import styles from './Detail.module.scss';
import EvolovesChain from './EvolovesChain';
import { POKEMON_TYPES } from '@/lib/constants';

const Detail = () => {
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const [baseStats, setBaseStats] = useState<Stat[]>([]);
  const [flavorText, setFlavorText] = useState('');
  const [genus, setGenus] = useState('');
  const [selectedFormName, setSelectedFormName] = useState('');
  const [selectedFormId, setSelectedFormId] = useState();
  const [evolvesChain, setEvolvesChain] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        const pokemonData = await getPokemonData(params.id ?? '');

        const speciesUrl = pokemonData.species.url;
        const speciesDetailData = await getPokemonSpecies(speciesUrl);

        const evolvesChainUrl = speciesDetailData.evolution_chain.url;
        const evolvesChainData = await getEvolvesDatas(evolvesChainUrl);

        console.log(evolvesChainUrl);

        const koreanSpeciesData = speciesDetailData.flavor_text_entries.find(
          (flavor_text_entries: { language: { name: string } }) =>
            flavor_text_entries.language.name === 'ko',
        );

        const koreanGenusData = speciesDetailData.genera.find(
          (genera: { language: { name: string } }) =>
            genera.language.name === 'ko',
        );

        setBaseStats(pokemonData.stats);
        setPokemon(pokemonData);
        setFlavorText(koreanSpeciesData.flavor_text);
        setGenus(koreanGenusData.genus);
        setEvolvesChain(evolvesChainData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataAPI();
  }, [params.id]);

  const onFormChange = async (formName: string) => {
    try {
      const FormChangeData = await getPokemonData(formName);

      const koreanFormName = FORM_NAMES[formName];

      setSelectedFormName(koreanFormName);
      setPokemon({ ...FormChangeData, id: pokemon?.id, name: pokemon?.name });
      setBaseStats(FormChangeData.stats);
      setSelectedFormId(FormChangeData.id);
    } catch (error) {
      console.log(error);
    }
  };

  const typeColor = pokemon?.types.map((typeInfo) => {
    return POKEMON_TYPES[typeInfo.type.name];
  });

  return (
    <>
      <div className={styles.detail__main}>
        <PokemonInfo
          pokemon={pokemon}
          onFormChange={onFormChange}
          formId={selectedFormId}
          genus={genus}
          flavorText={flavorText}
        />
        <PokemonImg pokemon={pokemon} formName={selectedFormName} />
        <Status baseStats={baseStats} typeColor={typeColor} />
      </div>
      <EvolovesChain evolvesChain={evolvesChain} />
      <div className={styles.detail__comments}>
        <Comments pokemon={pokemon} />
      </div>
    </>
  );
};

export default Detail;
