"use client";
import { Loader2 } from "lucide-react";

export default function Table({
  columns,
  data,
  actions,
  NotFound,
  maxHeight,
  loading,
}) {
  return (
    <div className="w-full bg-g-600">
      <div className={`overflow-y-auto`} style={{ maxHeight }}>
        <table className="min-w-full table-fixed border-separate border-spacing-0 text-sm">
          <thead className="bg-g-600 text-g-200 sticky top-0 ">
            <tr className="whitespace-nowrap">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-5 py-3 font-medium text-left border-y border-g-500 ${
                    index == columns.length - 1 ? " border-r-0" : "border-r"
                  } }`}
                >
                  {col.label}
                </th>
              ))}

              {actions && (
                <th className="px-5 py-3 text-left border-y border-g-500">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="bg-g-700 whitespace-nowrap">
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className={`px-5 py-4 text-g-300 ${
                        i === data.length - 1 ? "" : "border-b border-g-500"
                      }`}
                    >
                      {col?.render ? col?.render(row) : row[col?.key] || "-"}
                    </td>
                  ))}

                  {actions && (
                    <td
                      className={`px-5 py-4 text-g-300 ${
                        i === data.length - 1 ? "" : "border-b border-g-500"
                      }
                        `}
                    >
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="bg-g-700">
                <td colSpan={columns.length + (actions ? 2 : 1)}>
                  {loading ? (
                    <div className="w-full py-15 flex items-center justify-center">
                      <Loader2
                        className="animate-spin text-primary"
                        size={25}
                      />
                    </div>
                  ) : !data || data.length === 0 ? (
                    NotFound ? (
                      <NotFound />
                    ) : (
                      <p className="text-center text-g-300 py-5">
                        No data found.
                      </p>
                    )
                  ) : null}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
