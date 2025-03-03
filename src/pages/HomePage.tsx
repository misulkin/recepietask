import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMeals, fetchMealsBySearch } from "../api/mealApi";
import { Meal } from "../types/meal";
import { useDebounce } from "../hooks/useDebounce";
import { useSelectedMeals } from "../hooks/useSelectedMeals";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 10;

function HomePage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: allMeals = [],
        isLoading: allMealsLoading,
        error: allMealsError,
    } = useQuery<Meal[]>({
        queryKey: ["allMeals"],
        queryFn: fetchAllMeals,
    });

    const {
        data: searchMeals = [],
        isLoading: searchLoading,
        error: searchError,
    } = useQuery<Meal[]>({
        queryKey: ["searchMeals", debouncedSearch],
        queryFn: () => fetchMealsBySearch(debouncedSearch),
        enabled: !!debouncedSearch, // включаем только при непустом поиске
    });

    // Список категорий (из allMeals)
    const categories = useMemo(() => {
        const catSet = new Set<string>(["All"]);
        allMeals.forEach((meal) => {
        if (meal.strCategory) catSet.add(meal.strCategory);
        });
        return Array.from(catSet);
    }, [allMeals]);

    // либо searchMeals, либо allMeals
    const activeMeals = debouncedSearch ? searchMeals : allMeals;

    // Фильтрация по категории 
    const filteredMeals = useMemo(() => {
        if (selectedCategory === "All") return activeMeals;
        return activeMeals.filter((meal) => meal.strCategory === selectedCategory);
    }, [activeMeals, selectedCategory]);

    // Пагинация
    const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);
    const paginatedMeals = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredMeals.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredMeals, currentPage]);

    // При смене категории или поиске сбрасываем на первую страницу
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, debouncedSearch]);

    // Логика для  рецептов
    const { selectedIds, addSelected, removeSelected } = useSelectedMeals();

    if (allMealsLoading) return <p>Загрузка всех рецептов...</p>;
    if (allMealsError) return <p>Ошибка загрузки всех рецептов</p>;

    // Если идёт поиск показать состояние
    if (searchLoading) return <p>Поиск рецептов...</p>;
    if (searchError) return <p>Ошибка поиска</p>;

    return (
        <div>
        <h1>Список рецептов</h1>

        {/* Поле поиска */}
        <input
            type="text"
            placeholder="Поиск рецепта"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {/* Селект для выбора категории */}
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
            {categories.map((cat) => (
            <option key={cat} value={cat}>
                {cat}
            </option>
            ))}
        </select>

        {/* Карточки рецептов */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {paginatedMeals.map((meal) => {
            const isSelected = selectedIds.includes(meal.idMeal);
            return (
                <div
                key={meal.idMeal}
                style={{
                    width: "200px",
                    border: "1px solid #ccc",
                    padding: "10px",
                }}
                >
                <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{ width: "100%" }}
                />
                <h4>{meal.strMeal}</h4>
                <p>
                    {meal.strCategory} | {meal.strArea}
                </p>
                {isSelected ? (
                    <button onClick={() => removeSelected(meal.idMeal)}>
                    Убрать из выбранных
                    </button>
                ) : (
                    <button onClick={() => addSelected(meal.idMeal)}>
                    Добавить в выбранные
                    </button>
                )}
                </div>
            );
            })}
        </div>

        {/* Пагинация */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
        />
        </div>
    );
}

export default HomePage;