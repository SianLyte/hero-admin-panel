import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import Spinner from "../spinner/Spinner";
import { createHero } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";

const schema = yup
  .object({
    name: yup.string().required("Обязательное поле!"),
    description: yup.string().required("Обязательное поле!"),
    element: yup.string().required("Обязательное поле!"),
  })
  .required();

const HeroesAddForm = () => {
  const { filtersLoadingStatus } = useSelector((state) => state.filters);
  const filters = selectAll(store.getState());

  const { heroesCreatingStatus } = useSelector((state) => state.heroes);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);
  const onSubmit = (newHero) => {
    const id = uuidv4();
    const hero = {
      ...newHero,
      id,
    };
    dispatch(createHero(hero));
  };

  const setHeroesCreatingContent = () => {
    switch (heroesCreatingStatus) {
      case "loading":
        return (
          <div
            style={{
              display: "inline-block",
              position: "relative",
              top: "8px",
              left: "10px",
            }}
          >
            <Spinner />
          </div>
        );
      case "error":
        return <h5 className="text-center mt-5">Ошибка запроса</h5>;
      default: //idle
        return null;
    }
  };

  const setFilters = () => {
    return filters.map((filter) => {
      if (filter.name !== "all")
        return <option value={filter.name}>{filter.ru_name}</option>;
      else {
        return (
          <option disabled selected hidden>
            Я владею элементом...
          </option>
        );
      }
    });
  };

  const setFiltersLoadingContent = () => {
    switch (filtersLoadingStatus) {
      case "idle":
        return (
          <div className="mb-3">
            <label htmlFor="element" className="form-label">
              Выбрать элемент героя
            </label>
            <select
              {...register("element", { required: true })}
              className="form-select"
              name="element"
            >
              {setFilters()}
            </select>
          </div>
        );
      case "error":
        return <p>Ошибка загрузки...</p>;
      default: //loading
        return <Spinner />;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border p-4 shadow-lg rounded"
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Как меня зовут?"
          {...register("name", { required: true })}
        />
      </div>
      <p>{errors.name?.message}</p>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          {...register("description", { required: true })}
        />
      </div>
      <p>{errors.description?.message}</p>

      {setFiltersLoadingContent()}
      <p>{errors.element?.message}</p>

      <button
        type="submit"
        disabled={filtersLoadingStatus === "error"}
        className="btn btn-primary"
      >
        Создать
      </button>
      {setHeroesCreatingContent()}
    </form>
  );
};
const a = [];
console.log(a[a.length - 1]);

export default HeroesAddForm;
