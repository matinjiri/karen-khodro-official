"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FilterOption = {
  id: number;
  filterId: number;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
};

type Filter = {
  id: number;
  key: string;
  title: string;
  type: "SELECT" | "MULTI_SELECT" | "RANGE" | "BOOLEAN";
  options: FilterOption[];
};

type FilterValue =
  | string
  | string[]
  | boolean
  | undefined;

type DynamicFilterProps = {
  filter: Filter;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
};

export default function DynamicFilter({
  filter,
  value,
  onChange,
}: DynamicFilterProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-t border-gray-200 py-5">

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold">
          {filter.title}
        </h3>

        <ChevronDown
          size={18}
          className={`
            text-gray-400
            transition-transform
            duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div className="mt-4">

          {filter.type === "SELECT" && (
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => {
                const active =
                  value === option.value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      onChange(
                        active
                          ? ""
                          : option.value
                      )
                    }
                    className={`
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-bold
                      transition

                      ${
                        active
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {filter.type === "MULTI_SELECT" && (
            <div className="flex flex-wrap gap-2">
              {filter.options.map((option) => {
                const selected =
                  Array.isArray(value) &&
                  value.includes(option.value);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      const current =
                        Array.isArray(value)
                          ? value
                          : [];

                      if (selected) {
                        onChange(
                          current.filter(
                            (item) =>
                              item !==
                              option.value
                          )
                        );
                      } else {
                        onChange([
                          ...current,
                          option.value,
                        ]);
                      }
                    }}
                    className={`
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-bold
                      transition

                      ${
                        selected
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {filter.type === "BOOLEAN" && (
            <button
              type="button"
              onClick={() =>
                onChange(value === true ? false : true)
              }
              className={`
                w-full
                rounded-xl
                px-4
                py-3
                text-sm
                font-bold
                transition

                ${
                  value === true
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {value === true
                ? "فعال"
                : "انتخاب"}
            </button>
          )}

          {filter.type === "RANGE" && (
            <div className="text-sm text-gray-400">
              فیلتر بازه‌ای
            </div>
          )}

        </div>
      )}
    </div>
  );
}