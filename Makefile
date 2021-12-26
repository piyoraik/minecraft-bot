include .env

build:
	docker buildx build --platform linux/amd64 -t $(IMAGE_ID):latest .

up:
	@docker compose up -d

down:
	@docker compose down
