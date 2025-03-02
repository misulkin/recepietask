import { useQueryClient } from "@tanstack/react-query";

const SELECTED_KEY = "selectedMealsIds";

/**
 * Хук для работы с выбранными рецептами.
 * Хранит список ID выбранных рецептов в кэше React Query.
 */
export function useSelectedMeals() {
    const queryClient = useQueryClient();

    const getSelected = (): string[] => {
        return queryClient.getQueryData<string[]>([SELECTED_KEY]) || [];
    };

    const addSelected = (id: string) => {
        const current = getSelected();
        // Если уже есть, не дублируем
        if (current.includes(id)) return;
        queryClient.setQueryData([SELECTED_KEY], [...current, id]);
    };

    const removeSelected = (id: string) => {
        const current = getSelected();
        queryClient.setQueryData([SELECTED_KEY], current.filter((x) => x !== id));
    };

    return {
        selectedIds: getSelected(),
        addSelected,
        removeSelected,
    };
}