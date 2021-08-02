+++
date = 2020-01-15
title = "Create your own certificate authority with openssl - part two"
+++
In the [previous post](/blog/ssl-certificate-authority-with-openssl/) we
set up certificate authority (CA), installed a CA certificate in our browser and
went through the process of signing and using some server certificates. In this
we'll create some client certificates to identify ourselves with our servers.
We'll then explore using these in a few different contexts; installing them in
our browser, using them with curl and also with [socat](http://www.dest-unreach.org/socat/).
As with the previous post, you can see it all tied together in this related
[github repo](https://github.com/robyoung/nginx-client-certs).

This post assumes you have the files generated in the [previous post](/blog/ssl-certificate-authority-with-openssl/).

| File name                     | Use                                     |
| ----------------------------- | --------------------------------------- |
| `test-ca.key`                 | private key for the CA                  |
| `test-ca.pem`                 | root certificate (CA)                   |
| `test-server.key`             | private key for the server certificate  |
| `test-server-*-csr.pem`       | certificate signing requests for server |
| `test-server-static-cert.pem` | static server certificate               |

## Create a client certificate

Compared to creating a server certificate, which has lots of options, creating a client
certificate is pretty easy. First we create the private key. Note that if you want the
user to have to provide a password to use this client cert you just need to create a
passworded key and then use `passin` and `passout` when converting to PKCS later.

```bash
> openssl genrsa -out test-client.key 2048
```

Then we create our certificate signing request. Our subject can be pretty empty for a client
cert.

```bash
> openssl req -new \
  -subj "/C=GB" \
  -key test-client.key \
  -out test-client.csr
```

Then we create our signed client certificate.

```bash
> openssl x509 \
  -req -in test-client.csr \
  -passin pass:capassword \
  -CA test-ca.pem -CAkey test-ca.key -CAcreateserial \
  -out test-client.crt \
  -days 1825 -sha256
```

In order to use this client certificate in a browser we need to convert it to PKCS.

```bash
> openssl pkcs12 -export -clcerts \
  -in test-client.crt -inkey test-client.key -out test-client.p12
```

The steps to install it in the browser depend on the browser you're using. For Firefox
you scroll right to the bottom of the Privacy & Security tab of Preferences. Here click
on View Certificates then Your Certificates and finally Import your .p12 file.

Using the certificate with curl and socat is much simpler. We just need a combined PEM
including the key, certificate and CA certificate.

```bash
> cat test-client.key test-client.crt test-ca.pem > test-client.pem
```

Then this can then be used with curl

```bash
> curl --cacert test-ca.pem --cert test-client.pem http://dev.test
```

or with socat

```bash
> socat \
  tcp-listen:8096,fork,bind=127.0.0.1 \
  openssl-connect:dev.test:443,cert=test-client.pem,cafile=test-ca.pem
```

## Validating the client certificate

So far we've created a client certificate and seen how we can use it to talk to
a server. In order to be useful though, this needs to be validated by the server.

Let us extend the `nginx.vhost.conf` from the previous post. The relevant
options are
[`ssl_client_certificate`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_client_certificate) or
[`ssl_trusted_certificate`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_trusted_certificate) and
[`ssl_verify_client`](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_verify_client).

`nginx.vhost.conf`
```nginx
server {
  listen 443 ssl;

  server_name dev.test;

  ssl_client_certificate /etc/nginx/ssl/certs/test-ca.pem;
  ssl_verify_client on;

  ssl_certificate /etc/nginx/ssl/certs/server-crt.pem;
  ssl_certificate_key /etc/nginx/ssl/private/server.key;

  location / {
    return 200 'Static vhost test\n';
    add_header Content-Type text/plain;
  }
}
```

And here is the docker command to run it.

```bash
> docker run \
  --rm -p 443:443 \
  -v $(pwd)/nginx.vhost.conf:/etc/nginx/conf.d/default.conf:ro \
  -v $(pwd)/test-server.key:/etc/nginx/ssl/private/server.key:ro \
  -v $(pwd)/test-server-static-cert.pem:/etc/nginx/ssl/certs/server-crt.pem:ro \
  -v $(pwd)/test-ca.pem:/etc/nginx/ssl/certs/test-ca.pem:ro
  nginx
```

Now, if you still have all the configuration from the previous post,
we should be able to test it out.

```bash
> curl --cacert test-ca.pem --cert test-client.pem http://dev.test
Static vhost test
```

or via `socat`

```bash
> curl localhost:8096
Static vhost test
```

And we're all done!
