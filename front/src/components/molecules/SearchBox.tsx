"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface SearchBoxProps {
  defaultValue?: string;
  title: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ defaultValue = "", title }) => {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const clickHandler = () => {
    setQuery("");
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?${title}=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {title === "search" && (
        <button
          onClick={() => router.push("/admin/articles/createArticle")}
          className="px-6 h-10 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-md shadow hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
        >
          ایجاد مقاله جدید
        </button>
      )}
      <form onSubmit={handleSearch} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="جستجو کنید..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-700 bg-gray-800 p-2 rounded-lg flex-1 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700"
        >
          جستجو
        </button>
        <button
          onClick={clickHandler}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
        >
          خالی شدن
        </button>
      </form>
    </>
  );
};

export default SearchBox;
