"use client";
import { Search } from "@/types";
import { createContext, useContext, useState } from "react";
export const SearchContext = createContext<any>(null);

export const SearchProvider = ({ children }: any) => {
  const [search, setSearch] = useState<Search>({
    place: null,
    dates: [new Date(2023, 0, 1), new Date(2023, 0, 2)],
    guests: null,
  });

  return (
    <SearchContext.Provider value={
        {
          search,
          setSearch,
        }
    }>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};