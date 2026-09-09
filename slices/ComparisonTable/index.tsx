import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type ComparisonTableProps = SliceComponentProps<Content.ComparisonTableSlice>;

const ComparisonTable: FC<ComparisonTableProps> = ({ slice }) => {
  const table = slice.primary.table;
  if (!table) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="max-w-3xl mx-auto px-4 py-6"
    >
      {slice.primary.title && (
        <h3
          className="text-lg font-bold mb-3 text-foreground uppercase tracking-wide"
          style={{ fontFamily: "var(--font-oswald), sans-serif" }}
        >
          {slice.primary.title}
        </h3>
      )}
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm text-left">
          {table.head && (
            <thead className="bg-secondary">
              {table.head.rows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell) => (
                    <th key={cell.key} className="px-3 py-2 font-bold text-foreground border-b border-border">
                      {asText(cell.content)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody>
            {table.body.rows.map((row) => (
              <tr key={row.key} className="border-t border-border">
                {row.cells.map((cell) =>
                  cell.type === "header" ? (
                    <th key={cell.key} className="px-3 py-2 font-semibold text-foreground bg-secondary/50">
                      {asText(cell.content)}
                    </th>
                  ) : (
                    <td key={cell.key} className="px-3 py-2 text-muted-foreground">
                      {asText(cell.content)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {slice.primary.note && (
        <p className="mt-2 text-xs text-muted-foreground italic">{slice.primary.note}</p>
      )}
    </section>
  );
};

export default ComparisonTable;
