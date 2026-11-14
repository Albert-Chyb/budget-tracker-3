import z from "zod";

export const recordIdPathParamSchema = z
  .string()
  .regex(z.regexes.integer, {
    error: "Expected a string convertable to integer",
  })
  .pipe(z.transform((value) => Number.parseInt(value)));
