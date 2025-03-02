export interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    // Доп. поля по желанию:
    strTags?: string | null;
    strYoutube?: string | null;
    // Ингредиенты и меры (до 20):
    strIngredient1?: string;
    strMeasure1?: string;
    // ...
    strIngredient20?: string;
    strMeasure20?: string;
}