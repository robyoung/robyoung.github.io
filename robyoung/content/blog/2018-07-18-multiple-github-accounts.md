+++
title = "Managing multiple GitHub accounts"
date = 2018-07-18
+++
Authenticating correctly over SSH with multiple GitHub accounts can be a pain.
Here is how I manage it.

Before we start, why might you need multiple GitHub accounts at all? I
first came across the need when the permission requirements to log in to a
client's Jenkins asked for full read and write access to all my public and
private repositories. This was not needed but getting it changed was
going to be hard. Creating a separate work GitHub account solved the problem.

GitHub will not allow you to use the same SSH key for more than one account
because it would not be able to figure out which user to authenticate as.
As a result I needed to create a new SSH key pair for the new account and
upload that. However, then I had the problem that two SSH keys were both valid
for github. When I tried to use git, SSH tried the available keys until it found
one that worked and GitHub authenticated with that. There was no guarantee that
this was the correct one.

The way I got around the problem was to set up two sections in my `.ssh/config`,
each offering a different key and then change the host name on the work git
repositories to force them to use the work key.

### `.ssh/config`
```config
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
