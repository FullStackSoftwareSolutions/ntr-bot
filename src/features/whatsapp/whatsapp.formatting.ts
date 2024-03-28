import { table, TableUserConfig } from "table";

export const stringJoin = (...args: string[]) => args.join("\n");

export type FormatTableConfig = {
  hideKeys?: boolean;
} & TableUserConfig;

export type FormatListConfig = {
  header?: {
    content: string;
  };
};

export const formatList = (
  rows: { [key: string]: any }[],
  config?: FormatListConfig
) => {
  if (rows.length === 0) return "";

  const fields = Object.keys(rows[0]!);
  const headers = fields.map((header) => titleCase(header));

  const maxHeaderLength = headers.reduce((maxLength, header) => {
    return header.length > maxLength ? header.length : maxLength;
  }, 0);
  const separatorLine = "┏" + "━".repeat(maxHeaderLength);

  const data = rows.map((row) =>
    fields
      .map((header, index) => {
        let headerString = headers[index] ?? "<empty>";

        const valueString = row[header]?.toString() ?? "<empty>";

        return `┃ *${headerString}*: \`${valueString}\``;
      })
      .join("\n")
  );

  let headerString = config?.header?.content
    ? `${config.header.content}\n`
    : "";
  let listString = `${separatorLine}\n${data.join(`\n${separatorLine}\n`)}`;

  return `${headerString}${listString}`;
};

export const formatListMono = (
  rows: { [key: string]: any }[],
  config?: FormatListConfig
) => {
  if (rows.length === 0) return "";

  const fields = Object.keys(rows[0]!);
  const headers = fields.map((header) => titleCase(header));

  const maxHeaderLength = headers.reduce((maxLength, header) => {
    return header.length > maxLength ? header.length : maxLength;
  }, 0);

  const data = rows.flatMap((row) =>
    fields.map((header, index) => {
      let headerString = headers[index] ?? "<empty>";
      headerString = headerString.padEnd(maxHeaderLength, " ");

      const valueString = row[header]?.toString() ?? "<empty>";

      return `┃ ${headerString} | ${valueString}`;
    })
  );

  let headerString = "";
  let listString = data.join("\n");
  if (config?.header) {
    const headerUnderline = "┏" + "━".repeat(Math.floor(maxHeaderLength * 1.5));
    headerString = `${config.header.content}\n${headerUnderline}`;
  }

  return `${headerString}\n\`\`\`${listString}\`\`\``;
};

const defaultTableConfig = {
  columnDefault: {
    width: 15,
  },
  border: {
    topBody: `=`,
    bottomBody: `=`,
    joinBody: `-`,
    // topJoin: `-`,
    // topLeft: ` `,
    // topRight: ` `,
    // bottomJoin: `-`,
    // bottomLeft: `|`,
    // bottomRight: `|`,
    // bodyLeft: `│`,
    // bodyRight: `│`,
    // bodyJoin: `│`,
    // joinLeft: `|`,
    // joinRight: `|`,
    // joinJoin: `|`,
    // joinMiddleUp: `-`,
    // joinMiddleDown: `-`,
    // joinMiddleLeft: `-`,
    // joinMiddleRight: `-`,
  },
};

export const formatTable = (
  rows: { [key: string]: any }[],
  config?: FormatTableConfig
) => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]!);
  const data = rows.flatMap((row) =>
    headers.map((header) => [
      titleCase(header),
      row[header]?.toString() ?? "<empty>",
    ])
  );

  let tableData = data;

  const tableConfig = config ? { ...config } : {};
  delete tableConfig.hideKeys;

  const tableString = table(tableData, {
    ...defaultTableConfig,
    ...tableConfig,
  });

  return `\`\`\`${tableString}\`\`\``;
};

export const formatWideTable = (
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

  const tableString = table(tableData, {
    ...defaultTableConfig,
    ...tableConfig,
  });

  return `\`\`\`${tableString}\`\`\``;
};

export const titleCase = (s: string) => {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
