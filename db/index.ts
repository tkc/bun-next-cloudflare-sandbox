// Conditional import based on NODE_ENV
export const getDb =
  process.env.NODE_ENV === "development"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("./index.dev").getDb
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("./index.prod").getDb;
