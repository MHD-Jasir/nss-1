CREATE TABLE `coordinators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`custom_id` text NOT NULL,
	`name` text NOT NULL,
	`department` text NOT NULL,
	`password` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coordinators_custom_id_unique` ON `coordinators` (`custom_id`);--> statement-breakpoint
CREATE TABLE `departments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `departments_name_unique` ON `departments` (`name`);--> statement-breakpoint
CREATE TABLE `officer_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`officer_id` text NOT NULL,
	`password` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `officer_credentials_officer_id_unique` ON `officer_credentials` (`officer_id`);--> statement-breakpoint
CREATE TABLE `programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`venue` text NOT NULL,
	`coordinator_ids` text,
	`participant_ids` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `story_albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`batch_id` integer NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `story_batches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `story_batches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `story_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`album_id` integer NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`is_featured` integer DEFAULT false,
	`created_at` text NOT NULL,
	FOREIGN KEY (`album_id`) REFERENCES `story_albums`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `student_activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`student_custom_id` text NOT NULL,
	`badge` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`custom_id` text NOT NULL,
	`name` text NOT NULL,
	`department` text NOT NULL,
	`password` text NOT NULL,
	`profile_image_url` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_custom_id_unique` ON `students` (`custom_id`);