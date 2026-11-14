import z from "zod";

export const recordIdPathParamSchema = z.object({
  id: z
    .string()
    .regex(z.regexes.integer, {
      error: "Expected a string convertable to integer",
    })
    .pipe(z.transform((value) => Number.parseInt(value))),
});
