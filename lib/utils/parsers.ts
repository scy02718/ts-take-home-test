import { z, type ZodType } from "zod";

const UInt16: ZodType<number> = z
  .number()
  .int()
  .min(0)
  .max(65535);

export const Port: ZodType<number> = z.coerce.number().pipe(UInt16);
