+++
date = 2023-02-14
title = "Redirect stderr leaving stdout intact"
[taxonomies]
topics = ["linux"]
+++

This is a great little trick for redirecting stderr to another program while leaving stdout intact.

```bash
some-command 2> >( tee -a stderr.log >&2 )
```
