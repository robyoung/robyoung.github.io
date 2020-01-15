SHELL := /bin/bash
.PHONY: jekyll docker-build docker-run gke-tag gke-push

jekyll:
	@echo docker run --rm -v $$(pwd):/srv/jekyll jekyll/jekyll jekyll

build-jekyll:
	docker run --rm -v $$(pwd):/srv/jekyll jekyll/jekyll jekyll build

build-docker:
	docker build -t robyoung.digital:$$(git rev-parse --short HEAD) .
	docker tag robyoung.digital:$$(git rev-parse --short HEAD) robyoung.digital:latest

build: build-jekyll build-docker

serve: build-docker
	docker run -p 80:80 robyoung.digital

gke-tag:
	docker tag robyoung.digital eu.gcr.io/rob-young-digital/robyoung.digital
	docker tag robyoung.digital:$$(git rev-parse --short HEAD) eu.gcr.io/rob-young-digital/robyoung.digital:$$(git rev-parse --short HEAD)

gke-push:
	gcloud auth configure-docker
	docker push eu.gcr.io/rob-young-digital/robyoung.digital
	docker push eu.gcr.io/rob-young-digital/robyoung.digital:$$(git rev-parse --short HEAD)
