+++
date = 2022-11-06
title = "Logical Volume Manager"
[taxonomies]
topics = ["linux"]
+++

Today I used LVM (Logical Volume Manager) on a personal project for the first
time. I had come across it before and even had to use it for attaching new drives
but I had never set it up before and so hadn't taken the time to understand it.
So far, I love it.

## What is LVM?

LVM is a tool for managing physical disks and filesystems. The main benefit of
LVM is that your filesystems can be backed by multiple disks and can be freely
resized and even moved between storage devices.

There are three main concepts in LVM;

### Physical Volumes

These are the physical disks (or disk-like) devices at the very bottom.

```bash
# List physical volumes
sudo pvs
```

### Volume Groups

Physical volumes are grouped together into volume groups. This middle layer
allows you to easily add and remove disks from a volume group without having
to worry to much about which filesystems are using them.

```bash
# List volume groups
sudo vgs
```

### Logical Volumes

Volume groups are sliced up into logical volumes. These are equivalent to
disk partitions but on steroids!

```bash
# List logical volumes
sudo lvs
```

## Resources

I lot of what I read I found really confusing. As usual, DigitalOcean had
some great resources. I should learn to search DigitalOcean first.

- [An Introduction to LVM Concepts, Terminology, and Operations](https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations)
- [How To Use LVM To Manage Storage Devices](https://www.digitalocean.com/community/tutorials/how-to-use-lvm-to-manage-storage-devices-on-ubuntu-18-04)
- [The Complete Beginner's Guide to LVM in Linux](https://linuxhandbook.com/lvm-guide/)

## Useful related commands

```bash
# lists block devices. Always useful as a first step to see what is there.
sudo lsblk
```
