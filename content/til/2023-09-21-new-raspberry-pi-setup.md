+++
date = 2023-09-21
title = "New Raspberry Pi setup"
[taxonomies]
topics = ["linux"]
+++

Every now and then I get a new Raspberry Pi and I have to re-learn how to set it up. This time
I'm going to record the steps.

## The goal

I have a Raspberry Pi 4 with 8Gb of memory and a 500Gb SSD.
I want to use Raspbian for ease of use with the GPIOs.
I want to boot from the SSD.
I want to use LVM for managing the disk.

## Bootstrap

I bootstrapped an SD card with Raspbian using their [Raspberry Pi Imager](todo) tool.
The tool allows me to set up an SSH public key and default user.
Plug in the SSD, ethernet and power and off we go.

## Set up the filesystems

First check that everything expected is there.

```bash
> sudo lsblk
```

Then create the partion table with parted.

```bash
> sudo parted /dev/sda
(parted) mklabel gpt
(parted) mkpart primary ext4 1MiB 512MiB
Warning: The resulting partition is not properly aligned for best performance: 2048s % 65535s != 0s
```

Hmm, well that's not right.

<details>
    <summary>Aside into optimal IO size problems</summary>

That optimal alignment value looks really high. This is confirmed by looking at
`/sys/block/sda/queue/optimal_io_size` or by calling `lsblk -t`.

Apparently it is a problem with the disk reporting the correct value. See [this StackExchange answer](https://unix.stackexchange.com/a/496606/443570).
The fixes outlined there do not seem to work for me. Also, it looks like there should be a sanity check in the
SCSI kernel module to address this, [see this answer](https://askubuntu.com/a/1237638).

</details>

I'm going to ignore the parted warning as I know the values I provided do align.

```bash
> sudo parted /dev/sda
(parted) mklabel gpt
(parted) mkpart primary ext4 1MiB 512MiB
(parted) set 1 boot on
(parted) mkpart primary ext4 512MiB 100%
(parted) print
Model: CT480BX5 00SSD1 (scsi)
Disk /dev/sda: 480GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start   End    Size   File system  Name     Flags
 1      1049kB  537MB  536MB  ext4         primary  boot, esp
 2      537MB   480GB  480GB  ext4         primary
```

Format the boot partition.

```bash
> sudo mkfs.ext4 /dev/sda1
```

Set up my LVM Physical Volume and Volume Group.

```bash
> sudo pvcreate /dev/sda2
> sudo vgcreate local /dev/sda2
```

Set up my Logical Volumes.

```bash
> sudo lvcreate -L 20G -n root local
> sudo lvcreate -L 8G -n swap local
```

## Copy over the OS

```bash
sudo rsync -avx /boot /mnt/boot
```
