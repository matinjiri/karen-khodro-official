"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FilterOption = {
  id: number;
  filterId: number;
  value: string;
  label: string;
  isActive: boolean;
  sortOrder: number;
};

type BodyTypeFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  title?: string;
};

export default function BodyTypeFilter({
  value,
  onChange,
  options,
  title = "نوع خودرو",
}: BodyTypeFilterProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 py-5">

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-base font-bold">
          {title}
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
        <div className="mt-4 flex flex-wrap gap-2">

          {options.map((item) => {
            const active =
              value === item.value;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChange(
                    active
                      ? ""
                      : item.value
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
                {item.label}
              </button>
            );
          })}

        </div>
      )}

    </div>
  );
}