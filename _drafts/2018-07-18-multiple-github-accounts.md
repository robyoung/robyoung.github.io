---
layout: default
date: 2018-07-18
title: Managing multiple GitHub accounts
---
Authenticating correctly over SSH with multiple GitHub accounts can be a pain.
Here is how I manage it.

First up, I guess, is why might you need multiple GitHub accounts at all? I
first came across the need when the permission requirements to log in to a
client's Jenkins asked for full read and write access to all my public and
private repositories. This was clearly not needed but getting it changed was
going to be harder than just creating a separate work GitHub account.

GitHub will not allow you to use the same SSH key for more than one account
because it would not be able to determine with user to authenticate as.
So I create a new SSH key pair for the new work account and upload that.
However, now I have the problem that I have two SSH keys that are both valid 
for github. When I try to use git SSH tries the available keys until it finds
one that works and GitHub authenticates with that. There is no guarantee that
this is the correct one.

The way I got around the problem is to set up two sections in my `.ssh/config`,
each offering a different key and then change the host name on the work git
repositories to force them to use the work key.

### `.ssh/config`
```
Host github.com
  IdentityFile ~/.ssh/personal-ssh-key

Host github-work
  Hostname github.com
  IdentityFile ~/.ssh/work-ssh-key
```

### update origin host
```bash
> git config --replace-all remote.origin.url $(git config remote.origin.url | sed 's/github.com/github-work/g')
```
