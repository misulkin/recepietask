import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMealById } from "../api/mealApi";
import { Meal } from "../types/meal";

function RecipePage() {
    const { id } = useParams<{ id: string }>();

    const {
        data: meal,
        isLoading,
        error,
    } = useQuery<Meal | null>({
        queryKey: ["meal", id],
        queryFn: () => fetchMealById(id!),
        enabled: !!id,
    });
    //loading
    if (isLoading) return <p>Загрузка...</p>;
    if (error || !meal) return <p>Ошибка или рецепт не найден</p>;

    return (
        <div>
        <h1>{meal.strMeal}</h1>
        <img src={meal.strMealThumb} alt={meal.strMeal} width={300} />

        <p>
            <b>Категория:</b> {meal.strCategory}
        </p>
        <p>
            <b>Страна:</b> {meal.strArea}
        </p>

        <h3>Ингредиенты:</h3>
        <ul>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
            const ing = (meal as any)[`strIngredient${num}`];
            const measure = (meal as any)[`strMeasure${num}`];
            if (!ing || !ing.trim()) return null;
            return (
                <li key={num}>
                {measure} {ing}
                </li>
            );
            })}
        </ul>

        <h3>Инструкция:</h3>
        <p>{meal.strInstructions}</p>
        </div>
    );
}

export default RecipePage;