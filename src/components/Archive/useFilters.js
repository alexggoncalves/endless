import { create } from "zustand";

const useFilters = create((set) => ({
    filters: {
        genre: [],
        language: [],
        year: [],
    },
    addFilter: (type, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: [...state.filters[type], value],
            },
        }));
    },

    removeFilter: (type, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: state.filters[type].filter((filter) => {
                    return filter != value;
                }),
            },
        }));
    },

    clearFilter: (type) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [type]: [],
            },
        }));
    },

    clearAllFilters: () => {
        set((state) => ({
            filters: {
                genre: [],
                language: [],
                year: [],
            },
        }));
    },

}));

export default useFilters;
