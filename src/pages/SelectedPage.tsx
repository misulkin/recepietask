import { useQueries } from "@tanstack/react-query";
import { useSelectedMeals } from "../hooks/useSelectedMeals";
import { fetchMealById } from "../api/mealApi";
import { Meal } from "../types/meal";

function SelectedPage() {
    const { selectedIds } = useSelectedMeals();

    const results = useQueries({
        queries: selectedIds.map((id) => ({
        queryKey: ["selectedMeal", id],
        queryFn: () => fetchMealById(id),
        })),
    });


    const meals: Meal[] = results
        .map((r) => r.data)
        .filter((m): m is Meal => m !== null && m !== undefined);


    const ingredientsMap: Record<string, number> = {};
    meals.forEach((meal) => {
        for (let i = 1; i <= 20; i++) {
        const ing = (meal as any)[`strIngredient${i}`];
        if (ing && ing.trim()) {
            const key = ing.toLowerCase();
            ingredientsMap[key] = (ingredientsMap[key] || 0) + 1;
        }
        }
    });

    return (
        <div>
        <h1>Выбранные рецепты</h1>
        {meals.length === 0 ? (
            <p>Нет выбранных рецептов</p>
        ) : (
            <>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {meals.map((meal) => (
                <div
                    key={meal.idMeal}
                    style={{ border: "1px solid #ccc", width: 200 }}
                >
                    <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    style={{ width: "100%" }}
                    />
                    <p>{meal.strMeal}</p>
                </div>
                ))}
            </div>

            <h2>Общие ингредиенты:</h2>
            <ul>
                {Object.entries(ingredientsMap).map(([ingredient, count]) => (
                <li key={ingredient}>
                    {ingredient} — {count} раз(а)
                </li>
                ))}
            </ul>
            </>
        )}
        </div>
    );
}

export default SelectedPage;