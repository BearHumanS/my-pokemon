import { TypesType, filteredPokemonData } from '@/lib/type';
import styles from './pokemonCard.module.scss';
import Plate from '../plate/Plate';
import { POKEMON_TYPES } from '@/lib/constants';
import StatusBar from '../detail/StatusBar';
import useSelectedPokemonForCard from '@/store/useSelectedPokemonForCard';

interface PokemonCardProp {
  pokemonCardData: filteredPokemonData;
}

const PokemonCard = ({ pokemonCardData: data }: PokemonCardProp) => {
  const { pokemonName, pokemonNickName1, pokemonNickName2 } =
    useSelectedPokemonForCard();
  if (!Object.keys(data).length) {
    // 임시로 null처리
    // 추후 로딩 ui 등으로 처리하기
    return null;
  }

  const firstType = data?.types[0].type.name;
  const setClassName = (mainClassName: string) => {
    return firstType
      ? `${styles[mainClassName]} ${styles[POKEMON_TYPES[firstType]]}`
      : styles[mainClassName];
  };

  return (
    <div className={setClassName('wrapper')}>
      <div className={setClassName('pokemon_number')}>{`No.${data?.id}`}</div>
      <div className={styles.white_block}>
        <div className={setClassName('container')}>
          <div className={styles.container__top}>
            <div className={styles.type_containter}>
              {data?.types.map((pokemonType: TypesType) => (
                <Plate
                  key={pokemonType.type.name}
                  pokemonTypeProp={POKEMON_TYPES[pokemonType.type.name]}
                />
              ))}
            </div>
            <img
              className={styles.pokemon_image}
              src={data.sprites}
              alt="포켓몬 이미지"
            />
            <div className={styles.pokemon_intro}>
              <div className={styles.pokemon_name}>
                <span className={styles.text__small}>{pokemonNickName1}</span>
                <span className={styles.text__small}>{pokemonNickName2}</span>
              </div>
              <span className={styles.text__large}>{pokemonName}</span>
            </div>
          </div>
          <div className={styles.container__bottom}>
            <div>
              <div className={styles.status}>
                <span>체력</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[0]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
              <div className={styles.status}>
                <span>특수공격</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[3]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
            </div>
            <div>
              <div className={styles.status}>
                <span>공격</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[1]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
              <div className={styles.status}>
                <span>특수방어</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[4]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
            </div>
            <div>
              <div className={styles.status}>
                <span>방어</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[2]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
              <div className={styles.status}>
                <span>스피드</span>
                {data ? (
                  <StatusBar
                    baseStat={data?.stats[5]}
                    pokemonTypes={data?.types}
                  />
                ) : null}
              </div>
            </div>
            <div>
              <img
                className={styles.logo}
                src="/src/assets/logo-pokehub.png"
                alt="PoketHub"
              />
              <div className={styles.total_stat}>
                <span className={styles.text__small}>Total</span>
                <span className={styles.text__large}>
                  {data?.stats.reduce(
                    (acc, baseStat) => acc + baseStat.base_stat,
                    0,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
