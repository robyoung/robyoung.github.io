+++
date = 2023-02-13
title = "USB Serial on Linux"
[taxonomies]
topics = ["linux"]
+++

This documents my journey to getting a USB serial adapter working
on Linux so that I can flash [Sonoff Basic R2](https://sonoff.tech/product/diy-smart-switches/basicr2/)
with [ESPHome](https://esphome.io/). I had a cheap one based on a CH340G
hanging around that I could not get working so I forked out for one based on 
a a FTDI FT232RL which seemed to work out of the box.

## See what's going on

Let's look at `lsusb` and `dmesg` and see what we get when the CH340G adapter is plugged in.

*dmesg*
```dmesg
[ 2898.744517] usb 3-8.3: new full-speed USB device number 12 using xhci_hcd
[ 2898.894344] usb 3-8.3: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice= 2.63
[ 2898.894353] usb 3-8.3: New USB device strings: Mfr=0, Product=2, SerialNumber=0
[ 2898.894356] usb 3-8.3: Product: USB2.0-Serial
[ 2898.903026] ch341 3-8.3:1.0: ch341-uart converter detected
[ 2898.904184] usb 3-8.3: ch341-uart converter now attached to ttyUSB0
```

*lsusb*
```
*snip*
Bus 003 Device 015: ID 1a86:7523 QinHeng Electronics CH340 serial converter
*snip*
```

That looks promising. It's detected and recognised as a USB Serial Device. But hang on
a minute, almost immediately after we get.

```dmesg
[ 2899.501293] input: BRLTTY 6.4 Linux Screen Driver Keyboard as /devices/virtual/input/input35
[ 2899.502800] usb 3-8.3: usbfs: interface 0 claimed by ch341 while 'brltty' sets config #1
[ 2899.503336] ch341-uart ttyUSB0: ch341-uart converter now disconnected from ttyUSB0
[ 2899.503352] ch341 3-8.3:1.0: device disconnected
```

It looks like the device get's disconnected by [brltty](https://brltty.app/), which is apparently
a daemon for interfacing with a refreshable braille display. Thankfully I'm not blind and don't need
a braille display, so what's going on here. A little searching and I found [this
Stack Exchange answer](https://unix.stackexchange.com/a/670637) that confirms it is indeed a problem.

But hang on a minute. If I plug the FTDI device in it does not seem to be disconnected.

<details>
  <summary>dmesg output from connecting the FTDI adapter</summary>

```dmesg
[ 3205.419824] usb 3-8.3: USB disconnect, device number 12
[ 3208.506882] usb 3-8.3: new full-speed USB device number 13 using xhci_hcd
[ 3208.663598] usb 3-8.3: New USB device found, idVendor=0403, idProduct=6001, bcdDevice= 6.00
[ 3208.663608] usb 3-8.3: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[ 3208.663611] usb 3-8.3: Product: FT232R USB UART
[ 3208.663613] usb 3-8.3: Manufacturer: FTDI
[ 3208.663616] usb 3-8.3: SerialNumber: AQ027NY5
[ 3208.672641] ftdi_sio 3-8.3:1.0: FTDI USB Serial Device converter detected
[ 3208.672689] usb 3-8.3: Detected FT232RL
[ 3208.673439] usb 3-8.3: FTDI USB Serial Device converter now attached to ttyUSB0
```
</details>

Until I plug the CH340G in, and then both get disconnected (and incidentally my X keyboard config is lost as well).

<details>
  <summary>both adapters being disconnected by BRLTTY</summary>

```dmesg
[ 3282.474013] input: BRLTTY 6.4 Linux Screen Driver Keyboard as /devices/virtual/input/input36
[ 3282.476515] usb 3-8.1: usbfs: interface 0 claimed by ch341 while 'brltty' sets config #1
[ 3282.477350] ch341-uart ttyUSB1: ch341-uart converter now disconnected from ttyUSB1
[ 3282.477381] ch341 3-8.1:1.0: device disconnected
[ 3283.642093] usb 3-8.3: usbfs: interface 0 claimed by ftdi_sio while 'brltty' sets config #1
[ 3283.643357] ftdi_sio ttyUSB0: FTDI USB Serial Device converter now disconnected from ttyUSB0
[ 3283.643383] ftdi_sio 3-8.3:1.0: device disconnected
```
</details>

## Fix the BRLTTY issue

It looks like there are a couple of solutions to the problem. I went with
[this less aggressive approach](https://unix.stackexchange.com/a/680547), just commenting
out the offending udev rule in `/usr/lib/udev/rules.d/*-brltty-device.rules`.

I did also take [this users advice](https://unix.stackexchange.com/questions/670636/unable-to-use-usb-dongle-based-on-usb-serial-converter-chip#comment1264526_670637)
and removed `modemmanager` as I don't need it on my laptop and don't fancy any more surprises.

## References

- [How to check and use serial ports under linux](https://www.cyberciti.biz/faq/find-out-linux-serial-ports-with-setserial/)
