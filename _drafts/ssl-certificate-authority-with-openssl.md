---
layout: post
date: ---
title: Create your own certificate authority with openssl - part one
---
This post is part one of a series on working with openssl to manage your 
own certificate authority (CA) for a couple of different use cases. If you
just want to get a CA up and running for local development I thoroughly
recommend [mkcert](https://github.com/FiloSottile/mkcert). This series of posts
is an educational piece about doing it with openssl.

In this first part we'll create a CA with openssl, install it into our browser
and test it with a local web server.


