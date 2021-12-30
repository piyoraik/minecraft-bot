include .env

build:
	@docker compose build

buildx:
	@docker buildx build --platform linux/amd64 -t $(REPOSITORY):latest .

pushx:
	@docker push $(REPOSITORY):latest

up-test:
	@docker run --env-file docker.env -p 8080:8080 --tty --rm -d $(REPOSITORY):latest

up:
	@docker compose up -d

down:
	@docker compose down