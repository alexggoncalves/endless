import { create } from "zustand";

const useOrder = create((set) => ({
    order: {
        by: "title",
        direction: true, // direction: true -> asc  //  false -> desc
    },
    setOrder: (by, direction) => {
        set((state) => ({
            order: {
               by: by,
               direction:direction
            },
        }));
    },
}));

export default useOrder;
