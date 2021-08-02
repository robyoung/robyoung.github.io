+++
date = 2018-07-31
title = "Create your own certificate authority with openssl - part one"
+++
This post is part one of a series on working with openssl to manage your
own certificate authority (CA) for a couple of different use cases. If you
just want to get a CA up and running for local development I thoroughly
recommend [mkcert](https://github.com/FiloSottile/mkcert).

In this first part we'll create a CA with openssl, install it into our browser
and test it with a local web server. Note that I'll be providing all the
information on the command line to make it easier to script things.
To see it all tied together see this related [github repo](https://github.com/robyoung/nginx-client-certs).

## Create a certificate authority with OpenSSL

First we generate the private key for our CA (with a password other than
'capassword' preferably, and ensure it's not visible in your shell history).

```bash
> openssl genrsa -aes256 -passout pass:capassword -out test-ca.key 2048
```

Next we generate the root certificate. The fields in the subject name do not
affect the certificate's validity. They are queryable and shown when the certificate
is installed (firefox lists them by organisation) so use something that will remind you what it's for.

```bash
> openssl req -x509 -new -nodes \
  -passin pass:capassword \
  -key test-ca.key \
  -sha256 -days 1825 \
  -subj "/C=GB/O=robyoung.digital/CN=test" \
  -out test-ca.pem
```

And we're done! Next we're going to create a server certificate and sign it
with our shiny new CA key.

## Create a server certificate

As with the CA, our first step is to generate a private key for our server.
This time we don't want a password otherwise it becomes harder to install.

```bash
> openssl genrsa -out test-server.key 2048
```

Once we have a key we can generate our certificate signing request (CSR),
just like when we're using a public CA. This time the common name
is significant as clients will use it to determine whether the server is
authorised to serve that domain.

```bash
> openssl req -new \
  -subj "/C=GB/CN=dev.test" \
  -key test-server.key \
  -out test-server-static-csr.pem
```

If you need to support multiple domains with a single server certificate you
have two options. Wildcard certificates, where you use a star (\*) to match a
domain name segment or subject alternative names (SANs).

The wildcard certificate approach is pretty simple.

```bash
> openssl req -new \
  -subj "/C=GB/CN=*.dev.test" \
  -key test-server.key \
  -out test-server-wildcard-csr.pem
```

Subject alternative names (SAN) is an x509 extension that allows you
to add multiple domains to a single certificate. It is bit more complex
to implement on the command line. This
[Stack Exchange answer](https://security.stackexchange.com/a/91556) helped me
figure out how to do it. The path to your `openssl.cnf` is going to be system
dependent, on Linux it will probably be `/etc/ssl/openssl.cnf`, however on Mac
(using a homebrew installed openssl) it is at `/usr/local/etc/openssl/openssl.cnf`.

```bash
> openssl req -new \
  -subj "/C=GB/CN=dev.test" \
  -key test-server.key \
  -out test-server-san-csr.pem \
  -reqexts SAN \
  -config <( \
    cat /usr/local/etc/openssl/openssl.cnf \
        <(printf "[SAN]\nsubjectAltName=DNS:one.dev.test,DNS:two.dev.test\n") \
  )
```

While this is how you add SANs to a self signed key or a CSR you send to a
public CA, there is unfortunately a [bug in the x509 command](https://www.openssl.org/docs/manmaster/man1/x509.html#BUGS)
that means extensions are not passed from certificate requests to certificates.
For our purposes if we want SANs we're going to have to add them when we sign
the CSR.

First, our basic certificate with no SANs. For more information about the
extensions used see the [openssl x509 config docs](https://www.openssl.org/docs/manmaster/man5/x509v3_config.html).

```bash
> openssl x509 \
  -req -in test-server-static-csr.pem \
  -passin pass:capassword \
  -CA test-ca.pem -CAkey test-ca.key -CAcreateserial \
  -out test-server-static-cert.pem \
  -days 1825 -sha256 \
  -extfile <( cat <<EOF
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
EOF
)
```

With the SANs it is almost identical but with the `subjectAltName` extension.

```bash
> openssl x509 \
  -req -in test-server-static-csr.pem \
  -passin pass:capassword \
  -CA test-ca.pem -CAkey test-ca.key -CAcreateserial \
  -out test-server-san-cert.pem \
  -days 1825 -sha256 \
  -extfile <( cat <<EOF
subjectKeyIdentifier=hash
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage=digitalSignature,keyEncipherment
subjectAltName=DNS:one.dev.test,DNS:two.dev.test
EOF
)
```

We now have a CA certificate and a couple of server certificates signed by
that CA. It's time to test them out.

## Test with Nginx and Curl

First let's spin up an Nginx docker container with our static certificate
and server key. We're going to use a minimal ssl configuration, in real life
you're going to want something [much more robust](https://wiki.mozilla.org/Security/TLS_Configurations#Nginx).

`nginx.vhost.conf`
```nginx
server {
  listen 443 ssl;

  server_name dev.test;

  ssl_certificate /etc/nginx/ssl/certs/server-crt.pem;
  ssl_certificate_key /etc/nginx/ssl/private/server.key;

  location / {
    return 200 'Static vhost test\n';
    add_header Content-Type text/plain;
  }
}
```

```bash
> docker run \
  --rm -p 443:443 \
  -v $(pwd)/nginx.vhost.conf:/etc/nginx/conf.d/default.conf:ro \
  -v $(pwd)/test-server.key:/etc/nginx/ssl/private/server.key:ro \
  -v $(pwd)/test-server-static-cert.pem:/etc/nginx/ssl/certs/server-crt.pem:ro \
  nginx
```

Before we finally test this we're going to need `dev.test` to point to `127.0.0.1`.
If we were just testing with cur we could make use of the [`--resolve`](https://curl.haxx.se/docs/manpage.html#--resolve)
option to manually resolve. However, we also want this to work in a browser
so let's add it to our hosts file.

```bash
> echo "127.0.0.1 dev.test" >> /etc/hosts
```

Finally we're able test our certificate!

```bash
> curl --cacert test-ca.pem https://dev.test
Static vhost test
```

## Install the certificate authority

In order to test this in a browser we need to install the CA certificate. This
process varies between different platforms and can be tempremental (which is
one of the reasons [mkcert](https://github.com/FiloSottile/mkcert) is so great).
To make my life easier I'm going to describe adding the CA certificate to
Firefox as it allows you to manage your authorities from it's own preferences.

First open your Firefox "Preferences". Select "Privacy & Security". Scroll all
the way to the bottom and click "View Certificates". Here we want to click the
tab called "Authorities" and then click "Import". Select our `test-ca.pem` and
import.

You should now be able to visit [https://dev.test](https://dev.test) in Firefox
and see "Static vhost test" displayed. And we're done!

## Next steps

This has been a bit of a monster post but we now have a CA certificate installed
in our browser, a process for creating signed server certificates and a web
server that tests this out, all created with easily scriptable commands. In
the next post we'll create client certificates to identify ourselves with our
servers.
