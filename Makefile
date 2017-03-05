.PHONY: jekyll docker-build docker-run gke-tag gke-push

jekyll:
	jekyll build

docker-build:
	docker build -t robyoung.digital .

docker-run:
	docker run -p 80:80 robyoung.digital

gke-tag:
	docker tag robyoung.digital eu.gcr.io/rob-young-digital/robyoung.digital

gke-push:
	gcloud docker -- push eu.gcr.io/rob-young-digital/robyoung.digital
