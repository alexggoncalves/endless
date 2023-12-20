import { create } from "zustand";

const useFilters = create((set) => ({
    filters: {
        genre: [],
        language: [],
        year: [],
    },

    applyFilters: false,
    setApply: (value) =>
        set((state) => {
            applyFilters: value;
        }),

    addFilter: (type, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: [...state.filters[type], value],
            },
        })),
    removeFilter: (type, value) =>
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: state.filters[type].filter((filter) => {
                    return filter != value;
                }),
            },
        })),
}));

export default useFilters;
