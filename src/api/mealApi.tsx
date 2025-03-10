import axios from "axios";
import { Meal } from "../types/meal";

const API_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchAllMeals = async (): Promise<Meal[]> => {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    const allMeals: Meal[] = [];

    for (const letter of letters) {
        const { data } = await axios.get(`${API_URL}/search.php?f=${letter}`);
        if (data.meals) {
        allMeals.push(...data.meals);
        }
    }
    return allMeals;
    };


    export const fetchMealsBySearch = async (search: string): Promise<Meal[]> => {
    const { data } = await axios.get(`${API_URL}/search.php?s=${search}`);
    return data.meals || [];
    };

    export const fetchMealById = async (id: string): Promise<Meal | null> => {
    const { data } = await axios.get(`${API_URL}/lookup.php?i=${id}`);
    if (data.meals && data.meals.length > 0) {
        return data.meals[0];
    }
    return null;
};