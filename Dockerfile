# Testing ground: runs `bun test` / `bun test-storybook` (vitest, including the
# browser-mode "storybook" project driven by Playwright/Chromium) without needing
# Playwright's browser binaries installed on the host.
#
# Pinned to v1.62.1 (not the newer v1.63.0) to match the `playwright` devDependency
# in package.json — repo policy (bunfig.toml minimumReleaseAge) blocks installing
# playwright@1.63.0 until it's 7 days old. Bump both together once that clears.
FROM mcr.microsoft.com/playwright:v1.62.1-noble

# Bun rarely changes — install it before anything project-specific so this layer
# stays cached across every later rebuild. unzip is required by bun's installer
# and isn't present in the base image.
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
	&& rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app

# Install deps in their own layer, keyed only on the lockfile/manifest, so an
# ordinary source edit never invalidates `bun install` and rebuilds stay fast.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Source changes most often, so it goes last.
COPY . .

# Default: one-shot run matching what CI would execute. `docker-compose.yml`
# overrides this command for the bind-mounted watch-mode service.
CMD ["bunx", "vitest", "run"]
