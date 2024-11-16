import { sql, type AnyColumn, type SQL, is } from 'drizzle-orm';
import { type SelectedFields, PgTimestampString } from 'drizzle-orm/pg-core';
import { type SelectResultFields } from 'node_modules/drizzle-orm/query-builders/select.types';

// demo https://drizzle.run/se2noay5mhdu24va3xhv0lqo

export function jsonBuildObject<T extends SelectedFields>(
  shape: T,
  options: { distinct?: boolean },
) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }

    chunks.push(sql.raw(`'${key}',`));

    // json_build_object formats to ISO 8601 ...
    if (is(value, PgTimestampString)) {
      chunks.push(sql`timezone('UTC', ${value})`);
    } else {
      chunks.push(sql`${value}`);
    }
  });

  return sql<
    SelectResultFields<T>
  >`${options.distinct ? sql.raw('distinct ') : sql.raw('')}coalesce(jsonb_build_object(${sql.join(chunks)}), '{}')`;
}

export function jsonAggBuildObject<
  T extends SelectedFields,
  Column extends AnyColumn,
>(
  shape: T,
  options?: {
    orderBy?: { colName: Column; direction: 'ASC' | 'DESC' };
    distinct?: boolean;
    notNullColumn?: keyof T;
  },
) {
  return sql<
    SelectResultFields<T>[]
  >`coalesce(jsonb_agg(${jsonBuildObject(shape, { distinct: options?.distinct })}${
    options?.orderBy
      ? sql`order by ${options.orderBy.colName} ${sql.raw(options.orderBy.direction)}`
      : undefined
  })${options?.notNullColumn ? sql` filter (where ${shape[options.notNullColumn]} is not null)` : sql.raw('')}, '${sql`[]`}')`;
}
// exemple:
// await db
//   .select()
//   .from(existingDiscussionQuery)
//   .where(
//     arrayContained(
//       // from Drizzle
//       existingDiscussionQuery.participants,
//       toArray(
//         [
//           "c3b1399f-2c6b-40d7-9d37-cfaf9a7c6164",
//           "77c75084-7123-481b-a326-49c9ebceb431",
//         ],
//         "uuid[]"
//       )
//     )
//   );

// // you use it like that:
// const result = await db
//   .select({
//     post,
//     // keep only what you need from table theme
//     themes: jsonAggBuildObject({
//       id: theme.id,
//       label: theme.label,
//     }),
//   })
//   .leftJoin(postsThemes, eq(postsThemes.theme_id, post.theme_id))
//   .leftJoin(theme, eq(theme.id, postsThemes.theme_id))
//   .groupBy(post.id);
