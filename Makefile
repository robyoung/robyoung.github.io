SHELL := /bin/bash
.PHONY: build serve deploy

build:
	zola build

serve:
	zola serve --drafts

deploy:
	zola build
	git add public
	git commit -m "Zola build"
	git push origin HEAD
	git subtree push --prefix public origin gh-pages
