.PHONY: jekyll docker-build docker-run gke-tag gke-push

jekyll:
	jekyll build

docker-build:
	docker build -t robyoung.digital:$(git rev-parse --short HEAD) .
	docker tag robyoung.digital:$(git rev-parse --short HEAD) robyoung.digital:latest

docker-run:
	docker run -p 80:80 robyoung.digital

gke-tag:
	docker tag robyoung.digital eu.gcr.io/rob-young-digital/robyoung.digital
	docker tag robyoung.digital:$(git rev-parse --short HEAD) eu.gcr.io/rob-young-digital/robyoung.digital:$(git rev-parse --short HEAD)

gke-push:
	gcloud docker -- push eu.gcr.io/rob-young-digital/robyoung.digital
	gcloud docker -- push eu.gcr.io/rob-young-digital/robyoung.digital:$(git rev-parse --short HEAD)
