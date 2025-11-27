import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Students table
export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customId: text('custom_id').notNull().unique(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  password: text('password').notNull(),
  profileImageUrl: text('profile_image_url'),
  createdAt: text('created_at').notNull(),
});

// Coordinators table
export const coordinators = sqliteTable('coordinators', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customId: text('custom_id').notNull().unique(),
  name: text('name').notNull(),
  department: text('department').notNull(),
  password: text('password').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
});

// Programs table
export const programs = sqliteTable('programs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  venue: text('venue').notNull(),
  coordinatorIds: text('coordinator_ids', { mode: 'json' }),
  participantIds: text('participant_ids', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Departments table
export const departments = sqliteTable('departments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
});

// Student Activities table
export const studentActivities = sqliteTable('student_activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentCustomId: text('student_custom_id').notNull(),
  badge: text('badge').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});

// Officer Credentials table
export const officerCredentials = sqliteTable('officer_credentials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  officerId: text('officer_id').notNull().unique(),
  password: text('password').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Story Batches table
export const storyBatches = sqliteTable('story_batches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
});

// Story Albums table
export const storyAlbums = sqliteTable('story_albums', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  batchId: integer('batch_id').notNull().references(() => storyBatches.id),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
});

// Story Media table
export const storyMedia = sqliteTable('story_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  albumId: integer('album_id').notNull().references(() => storyAlbums.id),
  type: text('type').notNull(),
  url: text('url').notNull(),
  title: text('title'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});