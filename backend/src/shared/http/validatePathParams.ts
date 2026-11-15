import { createMiddleware } from "hono/factory";
import type z from "zod";

type Env<TPathParams> = {
  Variables: {
    validPathParams: TPathParams;
  };
};

export const validatePathParams = <TPathParams>(
  schema: z.ZodType<TPathParams>,
) => {
  return createMiddleware<Env<TPathParams>>(async (c, next) => {
    const { data, error } = schema.safeParse(c.req.param());
    if (error) return c.json(formatError(error), 400);

    c.set("validPathParams", data);

    await next();
  });
};

function formatError(error: z.ZodError) {
  return error.issues.map((issue) => formatIssue(issue));
}

function formatIssue(issue: z.core.$ZodIssue) {
  return {
    name: "invalid-path-param",
    paramName: issue.path.join("."),
    message: issue.message,
  };
}
