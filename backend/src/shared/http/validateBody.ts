import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import z from "zod";

type Env<TBody> = {
  Variables: {
    validBody: TBody;
  };
};

export const validateBody = <TBody>(schema: z.ZodType<TBody>) => {
  return createMiddleware<Env<TBody>>(async (c, next) => {
    const { data, error } = schema.safeParse(await c.req.json());
    if (error) throw new HTTPException(403, { message: error.message });

    c.set("validBody", data);

    await next();
  });
};
