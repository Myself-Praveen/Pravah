.PHONY: up down seed demo test simulate build

up:
	docker compose up -d

down:
	docker compose down

seed:
	pnpm --filter @pravah/db prisma db push
	pnpm --filter @pravah/db prisma db seed

demo:
	pnpm --filter @pravah/api dev &
	pnpm --filter @pravah/web dev

test:
	pnpm -r test

simulate:
	pnpm --filter @pravah/api test:simulate

build:
	pnpm -r build
