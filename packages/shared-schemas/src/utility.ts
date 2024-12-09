import { z } from "zod";

export type AssertEqual<T, U> =
  (<V>() => V extends T ? 1 : 2) extends <V>() => V extends U ? 1 : 2
    ? true
    : false;

export const matches =
  <T>() =>
  <S extends z.ZodType<T, z.ZodTypeDef, unknown>>(
    schema: AssertEqual<S["_output"], T> extends true
      ? S
      : S & {
          "types do not match": {
            expected: T;
            received: S["_output"];
          };
        }
  ): S => {
    return schema;
  };

// // example
// type User = {
//   name: string;
//   age?: number;
// };

// // the User schema type is properly inferred as ZodObject
// const user = matches<User>()(
//   z.object({
//     name: z.string(),
//     age: z.number().optional(),
//     // extra: z.string(), // uncomment to see error
//   })
// );
