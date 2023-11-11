// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import { changeCurrentFilter, fetchFilters, selectAll } from "./filtersSlice";
import Spinner from "../spinner/Spinner";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store";

const HeroesFilters = () => {
  const dispatch = useDispatch();
  const { filtersLoadingStatus } = useSelector((state) => state.filters);

  const filters = selectAll(store.getState());

  useEffect(() => {
    dispatch(fetchFilters());
    // dispatch(filtersFetching());
    // request("http://localhost:3001/filters")
    //   .then((filters) => dispatch(filtersFetched(filters)))
    //   .catch(() => dispatch(filtersFetchingError()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ChangeCurrentFilter = (e) => {
    document
      .querySelector(".btn-group")
      .childNodes.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    dispatch(changeCurrentFilter(e.target.id));
  };

  const renderFiltersList = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Фильтров пока нет</h5>;
    }

    return arr.map((filter) => {
      return (
        <button
          onClick={ChangeCurrentFilter}
          id={filter.name}
          className={`btn ${filter.style}`}
        >
          {filter.ru_name}
        </button>
      );
    });
  };

  const setFiltersLoadingContent = () => {
    switch (filtersLoadingStatus) {
      case "idle":
        return renderFiltersList(filters);
      case "error":
        return "Что-то пошло не так...";
      default: //loading
        return <Spinner />;
    }
  };

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">{setFiltersLoadingContent()}</div>
      </div>
    </div>
  );
};

export default HeroesFilters;
