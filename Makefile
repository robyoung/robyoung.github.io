SHELL := /bin/bash
.PHONY: build serve deploy

build:
	zola build

serve:
	zola serve --drafts

deploy: build
	cp -r public ..
	git checkout gh-pages
	rm -r *
	cp -r ../public/* .
	git add .
	git commit -m "Deploy to gh-pages"
	rm -r ../public
