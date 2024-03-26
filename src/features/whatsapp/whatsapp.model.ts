import { table, TableUserConfig } from "table";

export const stringJoin = (...args) => args.join("\n");

export const formatTable = (
  rows: { [key: string]: any }[],
  config?: TableUserConfig
) => {
  const headers = Object.keys(rows[0]);
  const data = rows.map((row) =>
    headers.map((header) => row[header].toString())
  );
  const tableString = table([headers.map(titleCase), ...data], config);

  return `\`\`\`${tableString}\`\`\``;
};

const titleCase = (s: string) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
