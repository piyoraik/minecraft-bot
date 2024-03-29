include .env

build:
	@docker compose build

buildx:
	@docker buildx build --platform linux/amd64 -t $(REPOSITORY):latest .

pushx:
	@docker push $(REPOSITORY):latest

up:
	@docker compose up -d

flogs:
	@docker logs -f node

down:
	@docker compose down