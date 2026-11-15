import { createMiddleware } from "hono/factory";
import z from "zod";

type Env<TBody> = {
  Variables: {
    validBody: TBody;
  };
};

export const validateBody = <TBody>(schema: z.ZodType<TBody>) => {
  return createMiddleware<Env<TBody>>(async (c, next) => {
    const { data, error } = schema.safeParse(await c.req.json());
    if (error) return c.json(formatError(error), 400);

    c.set("validBody", data);

    await next();
  });
};

function formatError(error: z.ZodError) {
  return error.issues.map((issue) => formatIssue(issue));
}

function formatIssue(issue: z.core.$ZodIssue) {
  return {
    name: "invalid-request-body",
    path: issue.path.join("."),
    message: issue.message,
  };
}
