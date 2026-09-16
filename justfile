# justfile
set dotenv-load := true

# Show available commands
default:
	@just --list

# Generate a new migration from schema changes
generate name="":
	#!/usr/bin/env bash
	if [ -z "{{name}}" ]; then
		npx drizzle-kit generate
	else
		npx drizzle-kit generate --name={{name}}
	fi

# Apply pending migrations to the database
migrate:
	secretspec run --scope drizzle -- npx drizzle-kit migrate

# Push schema directly to db (no migration files, good for prototyping)
push:
	secretspec run --scope drizzle -- npx drizzle-kit push

# Open Drizzle Studio to browse the db
studio:
	secretspec run --scope drizzle -- npx drizzle-kit studio

# Check migration status / pending diffs
check:
	secretspec run --scope drizzle -- npx drizzle-kit check

# Show current schema diff without applying
diff:
	secretspec run --scope drizzle -- npx drizzle-kit up

# Drop a migration file (interactive picker from drizzle-kit)
drop:
	secretspec run --scope drizzle -- npx drizzle-kit drop

# Revert the last applied migration (custom script, see below)
revert:
	secretspec run --scope drizzle -- npx tsx scripts/revert-migration.ts

# Full cycle: generate + migrate in one step
sync name="":
	just generate {{name}}
	just migrate

import-env env_path:
	secretspec import --delete-source dotenv:{{env_path}}
	rm {{env_path}}

import-env-from-doppler:
	secretspec delete --all --yes
	doppler secrets download --no-file --format env > doppler.env
	just import-env doppler.env

add-component name:
	bunx --bun shadcn@latest add {{name}}

dbconnect:
	lua ~/scripts/dbconnect.lua secretspec --profile default --scope dbui --vars DATABASE_URL