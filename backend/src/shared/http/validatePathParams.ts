import { createMiddleware } from "hono/factory";
import type z from "zod";
import { HTTPException } from "hono/http-exception";

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
    if (error) throw new HTTPException(403, { message: error.message });

    c.set("validPathParams", data);

    await next();
  });
};
