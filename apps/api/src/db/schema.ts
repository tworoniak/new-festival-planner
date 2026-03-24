// import {
//   pgTable,
//   uuid,
//   text,
//   timestamp,
//   date,
//   integer,
//   primaryKey,
// } from 'drizzle-orm/pg-core';

// export const festivals = pgTable('festivals', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   slug: text('slug').notNull().unique(),
//   name: text('name').notNull(),
//   description: text('description'),
//   shortDescription: text('short_description'),
//   startDate: date('start_date').notNull(),
//   endDate: date('end_date').notNull(),
//   location: text('location').notNull(),
//   imageUrl: text('image_url'),
//   heroImageUrl: text('hero_image_url'),
//   createdAt: timestamp('created_at').defaultNow(),
// });

// export const stages = pgTable('stages', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   festivalId: uuid('festival_id').references(() => festivals.id, {
//     onDelete: 'cascade',
//   }),
//   name: text('name').notNull(),
//   order: integer('order').default(0),
// });

// export const artists = pgTable('artists', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   name: text('name').notNull(),
//   imageUrl: text('image_url'),
//   genre: text('genre'),
//   bio: text('bio'),
//   createdAt: timestamp('created_at').defaultNow(),
// });

// export const sets = pgTable('sets', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   festivalId: uuid('festival_id').references(() => festivals.id, {
//     onDelete: 'cascade',
//   }),
//   stageId: uuid('stage_id').references(() => stages.id, {
//     onDelete: 'cascade',
//   }),
//   artistId: uuid('artist_id').references(() => artists.id),
//   startTime: timestamp('start_time').notNull(),
//   endTime: timestamp('end_time').notNull(),
//   day: integer('day').notNull(),
// });

// export const userFavorites = pgTable(
//   'user_favorites',
//   {
//     userId: text('user_id').notNull(),
//     artistId: uuid('artist_id').references(() => artists.id, {
//       onDelete: 'cascade',
//     }),
//   },
//   (t) => ({
//     pk: primaryKey({ columns: [t.userId, t.artistId] }),
//   }),
// );

// export const userPlanItems = pgTable('user_plan_items', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   userId: text('user_id').notNull(),
//   festivalId: uuid('festival_id').references(() => festivals.id, {
//     onDelete: 'cascade',
//   }),
//   setId: uuid('set_id').references(() => sets.id, { onDelete: 'cascade' }),
//   addedAt: timestamp('added_at').defaultNow(),
// });

// import {
//   pgTable,
//   text,
//   timestamp,
//   boolean,
//   // integer,
// } from 'drizzle-orm/pg-core';

// // ─── Better Auth required tables ────────────────────────────────────────────

// export const users = pgTable('users', {
//   id: text('id').primaryKey(),
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   emailVerified: boolean('email_verified').notNull().default(false),
//   image: text('image'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export const sessions = pgTable('sessions', {
//   id: text('id').primaryKey(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   token: text('token').notNull().unique(),
//   expiresAt: timestamp('expires_at').notNull(),
//   ipAddress: text('ip_address'),
//   userAgent: text('user_agent'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export const accounts = pgTable('accounts', {
//   id: text('id').primaryKey(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   accountId: text('account_id').notNull(),
//   providerId: text('provider_id').notNull(),
//   accessToken: text('access_token'),
//   refreshToken: text('refresh_token'),
//   expiresAt: timestamp('expires_at'),
//   password: text('password'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at')
//     .notNull()
//     .$onUpdate(() => new Date()),
// });

// export const verifications = pgTable('verifications', {
//   id: text('id').primaryKey(),
//   identifier: text('identifier').notNull(),
//   value: text('value').notNull(),
//   expiresAt: timestamp('expires_at').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
// });

// // ─── App domain tables ───────────────────────────────────────────────────────

// export const festivals = pgTable('festivals', {
//   id: text('id').primaryKey(),
//   name: text('name').notNull(),
//   location: text('location').notNull(),
//   startDate: timestamp('start_date').notNull(),
//   endDate: timestamp('end_date').notNull(),
//   genre: text('genre'),
//   imageUrl: text('image_url'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// export const artists = pgTable('artists', {
//   id: text('id').primaryKey(),
//   name: text('name').notNull(),
//   genre: text('genre'),
//   imageUrl: text('image_url'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// export const sets = pgTable('sets', {
//   id: text('id').primaryKey(),
//   festivalId: text('festival_id')
//     .notNull()
//     .references(() => festivals.id, { onDelete: 'cascade' }),
//   artistId: text('artist_id')
//     .notNull()
//     .references(() => artists.id, { onDelete: 'cascade' }),
//   stage: text('stage'),
//   startTime: timestamp('start_time').notNull(),
//   endTime: timestamp('end_time').notNull(),
// });

// export const plans = pgTable('plans', {
//   id: text('id').primaryKey(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   festivalId: text('festival_id')
//     .notNull()
//     .references(() => festivals.id, { onDelete: 'cascade' }),
//   name: text('name').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// export const favorites = pgTable('favorites', {
//   id: text('id').primaryKey(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => users.id, { onDelete: 'cascade' }),
//   festivalId: text('festival_id').references(() => festivals.id, {
//     onDelete: 'cascade',
//   }),
//   artistId: text('artist_id').references(() => artists.id, {
//     onDelete: 'cascade',
//   }),
// });

import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ─── Better Auth tables ──────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});

// ─── App domain tables ───────────────────────────────────────────────────────

export const festivals = pgTable('festivals', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url'),
  heroImageUrl: text('hero_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stages = pgTable('stages', {
  id: uuid('id').defaultRandom().primaryKey(),
  festivalId: uuid('festival_id').references(() => festivals.id, {
    onDelete: 'cascade',
  }),
  name: text('name').notNull(),
  order: integer('order').default(0),
});

export const artists = pgTable('artists', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  genre: text('genre'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sets = pgTable('sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  festivalId: uuid('festival_id').references(() => festivals.id, {
    onDelete: 'cascade',
  }),
  stageId: uuid('stage_id').references(() => stages.id, {
    onDelete: 'cascade',
  }),
  artistId: uuid('artist_id').references(() => artists.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  day: integer('day').notNull(),
});

export const userFavorites = pgTable(
  'user_favorites',
  {
    userId: text('user_id').notNull(),
    artistId: uuid('artist_id').references(() => artists.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.artistId] }),
  }),
);

export const userPlanItems = pgTable('user_plan_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  festivalId: uuid('festival_id').references(() => festivals.id, {
    onDelete: 'cascade',
  }),
  setId: uuid('set_id').references(() => sets.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow(),
});
