import { table, TableUserConfig } from "table";

export const stringJoin = (...args: string[]) => args.join("\n");

export type FormatTableConfig = {
  hideKeys?: boolean;
} & TableUserConfig;

export const formatTable = (
  rows: { [key: string]: any }[],
  config?: FormatTableConfig
) => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]!);
  const data = rows.map((row) =>
    headers.map((header) => row[header]?.toString() ?? "<empty>")
  );

  let tableData = data;
  if (!config?.hideKeys) {
    tableData = [headers.map(titleCase), ...data];
  }

  const tableConfig = config ? { ...config } : {};
  delete tableConfig.hideKeys;

  const tableString = table(tableData, tableConfig);

  return `\`\`\`${tableString}\`\`\``;
};

const titleCase = (s: string) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
