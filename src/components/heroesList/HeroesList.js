import { useHttp } from "../../hooks/http.hook";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchHeroes, deleteHero, filteredHeroesSelector } from "./heroesSlice";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

const HeroesList = () => {
  const { heroesLoadingStatus } = useSelector((state) => state.heroes);
  const { heroesDeletingStatus } = useSelector((state) => state.heroes);
  const dispatch = useDispatch();
  const { request } = useHttp();

  const filteredHeroes = useSelector(filteredHeroesSelector);

  // const filteredHeores = useSelector((state) => {
  //   if (state.filters.currentFilter === "all") {
  //     console.log("render");
  //     return state.heroes.heroes;
  //   } else {
  //     return state.heroes.heroes.filter(
  //       (hero) => hero.element === state.filters.currentFilter
  //     );
  //   }
  // });

  useEffect(() => {
    dispatch(fetchHeroes(request));
    // eslint-disable-next-line
  }, []);

  const deleteHeroById = useCallback(
    (id) => dispatch(deleteHero(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );
  const renderHeroesList = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>;
    }

    // eslint-disable-next-line array-callback-return
    return arr.map(({ id, ...props }) => {
      return (
        <HeroesListItem
          heroesDeletingStatus={heroesDeletingStatus}
          deleteHero={() => deleteHeroById(id)}
          key={id}
          {...props}
        />
      );
    });
  };

  const setHeroesLoadingContent = () => {
    switch (heroesLoadingStatus) {
      case "idle":
        return renderHeroesList(filteredHeroes);
      case "loading":
        return <Spinner />;
      default: //error
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
    }
  };

  return <ul>{setHeroesLoadingContent()}</ul>;
};

export default HeroesList;
