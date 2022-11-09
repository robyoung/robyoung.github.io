+++
date = 2021-08-26
title = "First steps with Embedded Rust: Selecting a board"
[taxonomies]
topics = ["rust", "embedded"]
+++

# Selecting a board

There are a bewildering array of microcontrollers out there and an equally bewildering
array of exciting projects going on in the embedded Rust world. So, how do I know where
to start?

I have tried to focus on things I think are most important to someone with very little 
embedded experience. That may not fit you exactly. I will try to point out adjacent 
options as I go so please don’t stop reading just yet.

If you just want to be told what to buy you can skip
[straight to the end](#what-board-should-i-get).


## What do we want in a development board?

So, what do we actually want in a development board? I’ve tried to order the criteria 
in a way that allows us to whittle down our options as we go.

* Good architecture support
* Good chip support
* An active community
* Built in debugger


## What architecture should I get?

The architecture with the most complete libraries, most thorough guides and the largest 
community around it is ARM Cortex-M. ARM Cortex-M are low power, low cost processors 
aimed at microcontroller applications. Looking at downloads on crates.io is not a 
perfect metric but it gives an idea of the difference in scale. In the last 90 days the 
cortex-m crate had over 250k downloads. The largest architecture crates for RISC-V, AVR, 
or Xtensa had at most 3k downloads and the cortex-a crate had about 18k downloads. ARM 
Cortex-M is in a league of its own.

Before we zoom off down ARM Cortex-M boulevard let's take a quick look sideways at the 
architectures we're leaving behind.

### AVR

AVR is a family of 8-bit microcontrollers mainly used in embedded systems. Thanks to 
Arduino there are a lot of AVR development boards out there and lots of support for them 
outside of Rust. Within the Rust ecosystem they are not as well supported. Until 
recently you needed to use a fork of rustc to build for AVR. There are a couple of 
different options now and [awesome-avr-rust](https://github.com/avr-rust/awesome-avr-rust)
is a good place to start.


### ARM Cortex-A

{{ image(name="arm-logo.png", alt="ARM logo", width=200, float="left", hide_alt=true) }}

These are bigger, beefier multi-core ARM processors designed for running bigger things. 
You would usually run a full operating system on them. For example; this is the 
architecture used in most smartphones and handheld games consoles. Check out the [cortex-a](https://crates.io/crates/cortex-a)
crate for more info.


### RISC-V

{{ image(name="riscv-logo.png", alt="RISC-V logo", width=200, float="left", hide_alt=true) }}

This seems to be the new hotness when it comes to machine architectures. It is a free 
and open Instruction Set Architecture (ISA). It has also been designed from outset to 
be modular. This means chip designers can create a wide variety of specialised chips. 
Although at the moment the range of development boards is small. There is an active 
Rust RISC-V community so it's worth keeping an eye on. If you’re interested in learning 
more, [SiFive](https://www.sifive.com/why) or [www.riscv.org](www.riscv.org) are both 
great places to start. In terms of Rust check out the [riscv](https://crates.io/crates/riscv)
crate.


### Xtensa

The most popular group of boards here are the 
[ESP32](https://www.espressif.com/en/products/devkits) family of chips from Espressif. 
They are small, cheap, WiFi enabled boards. They are great. It should be noted that 
not all ESP32 boards use Xtensa chips, the new [ESP32-C3](https://hackaday.com/2021/02/08/hands-on-the-risc-v-esp32-c3-will-be-your-new-esp8266/)
is RISC-V based. Probably the biggest hurdle to using Rust on Xtensa chips is that it’s 
not supported by llvm so you need to build the [esp-rs fork of rust](https://github.com/esp-rs/rust).


## What chip should I get?

So, we’re going to use an ARM Cortex-M. That narrows down our search but there are still 
a lot of options. If we go through the [cortex-m crate’s dependants](https://crates.io/crates/cortex-m/reverse_dependencies)
we’ll see that there are two groups of chips used more than any others; the [STM32 series](https://www.st.com/content/st_com/en/products/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html)
of chips and the [nRF5 series](https://www.nordicsemi.com/Products/Bluetooth-Low-Energy), this 
is where we’re going to focus the search.


### STM32

The STM32 series of chips are probably the most widely used ARM Cortex-M chips for 
embedded rust. There are a lot of chips in the stm32 family and they have long and 
incomprehensible names like STM32F401CCU6. If you’re interested there is 
[a guide to understanding the naming convention](https://www.digikey.com/en/maker/blogs/2020/understanding-stm32-naming-conventions). 

The STM32 [Peripheral Access Crates (PAC)](https://docs.rust-embedded.org/book/appendix/glossary.html#pac)
are defined in the [stm32-rs/stm32-rs](https://github.com/stm32-rs/stm32-rs)
repo and you can find various [Hardware Abstraction Layer (HAL)](https://docs.rust-embedded.org/book/appendix/glossary.html#hal)
and [Board Support (BSP)](https://docs.rust-embedded.org/book/appendix/glossary.html#bsp)
crates in the [stm32-rs](https://github.com/stm32-rs) GitHub organisation.

There is a chat room for discussion on all STM32 chips at [#stm32-rs:matrix.org](https://matrix.to/#/#stm32-rs:matrix.org).

{{ image(name="STM32F103C8T6_Black_Pill-2.jpg", alt="Black Pill", float="left", width=200, source="https://stm32-base.org/boards/STM32F103C8T6-Black-Pill.html", source_name="stm32-base.org", show_alt=true) }}

Two of the most popular STM32 boards are the [Blue Pill](https://stm32-base.org/boards/STM32F103C8T6-Blue-Pill)
and [Black Pill](https://stm32-base.org/boards/STM32F103C8T6-Black-Pill). There are a 
bunch of blogs about using them with rust. The main downside is that they do not come 
with an on board debugger. And for that reason alone I think they make a great second 
board.

{{ image(name="STM32F3-discovery.jpg", alt="STM32F3 Discovery", float="right", width=200, source="https://www.st.com/en/evaluation-tools/stm32f3discovery.html", source_name="st.com") }}

If you want an STM32 based board with a debugger then getting one of the official 
[STMicroelectronics discovery kits](https://www.st.com/en/evaluation-tools/stm32-discovery-kits.html)
is a great option (an STM32F3 or STM32F4 are good bets). The original version of the 
[Rust Embedded Discovery book](https://docs.rust-embedded.org/discovery/) is written 
targeting the STM32F3 discovery board so there is really high quality beginner focused 
documentation. If you go for a discovery board I would definitely start there.


### nRF5

The second most widely used family of ARM Cortex-M chips for embedded rust is the 
[nRF5 series](https://www.nordicsemi.com/Products/Bluetooth-Low-Energy) from Nordic 
Semiconductor. The PACs are defined in the [nrf-rs/nrf-pacs](https://github.com/nrf-rs/nrf-pacs) 
repo, the HALs are defined in the [nrf-rs/nrf-hal](https://github.com/nrf-rs/nrf-hal) 
and there are various BSPs in the [nrf-rs](https://github.com/nrf-rs) organisation. 
There is a chat room for discussion on all nRF chips at [#nrf-rs:matrix.org](https://matrix.to/#/#nrf-rs:matrix.org).

{{ image(name="nRF52840-DK.jpg", alt="nRF52840 Development Kit", float="left", width=300, source="https://www.nordicsemi.com/Products/Development-hardware/nRF52840-DK", source_name="nordicsemi.com") }}

The official [development kits](https://www.nordicsemi.com/Products/Bluetooth-Low-Energy/Development-hardware) 
(DK) are great first boards. The [knurling-rs sessions](https://knurling.ferrous-systems.com/sessions/) 
from Ferrous Systems use the [nRF52840 Development Kit](https://www.nordicsemi.com/Products/Development-hardware/nRF52840-DK).
The knurling sessions are really high quality, hands on guides that teach you embedded 
rust with interesting, fun projects. I think that right now, they are the best entry 
point to embedded development with rust. The one challenge I had was the space required. 
I live in an apartment with my partner and a toddler. I do not have the space to safely 
leave a project with lots of wires and small components lying around, and I only have 
free time for a couple of hours in the evening. I found myself constantly packing things 
up and setting them up again to make a tiny amount of progress.

{{ image(name="microbit-v2.png", alt="BBC micro:bit V2", float="right", width=200, source="https://www.microbit.org/", source_name="microbit.org") }}

Another great nRF based development board is the [BBC micro:bit](https://www.microbit.org/).
It comes with an on board debugger and a bunch of fun on board peripherals like an LED 
display, buttons and sensors all on the board. The BBC micro:bit is designed as an 
educational platform so the hardware is documented in a really beginner friendly way on 
their [developer community](https://tech.microbit.org/) and there are loads of project 
ideas around the internet (albeit in languages other than Rust). Check out the [examples in the micro:bit BSP](https://github.com/nrf-rs/microbit/tree/main/examples) 
for some idea of what you can do. 


### RP2040

The last chip we’re going to look at is a bit of a curveball. The [RP2040](https://www.raspberrypi.org/documentation/rp2040/getting-started/),
released at the end of 2020, is the Raspberry Pi Foundation’s first foray into designing 
their own silicon. Being so new, Rust support for it is still very much in development. 
You can find the PAC, the HAL and a bunch of supporting tools in the [rp-rs](https://github.com/rp-rs) 
organisation on GitHub. There is a chat room dedicated to the RP2040 at [#rp-rs:matrix.org](https://matrix.to/#/#rp-rs:matrix.org).

{{ image(name="raspberry-pi-pico.png", alt="Raspberry Pi Pico", float="left", width=200, source="https://www.raspberrypi.org/documentation/rp2040/getting-started/", source_name="raspberrypi.org") }}

Like the BBC micro:bit the RP2040 is geared towards being an educational platform so the 
hardware documentation is first class and there are loads of beginner friendly code 
examples and libraries in other programming languages. That said there isn’t much 
beginner friendly documentation for Embedded Rust on the RP2040. This is a really 
exciting platform and there is a huge amount of activity around it in the Embedded Rust 
community so definitely keep an eye on it, but it probably isn’t ideal as your first board.


## What’s the fuss about an on board debugger?

When you run a program on your host machine you can easily run it in your shell and see 
printed output. This is more difficult on an embedded target. You can make an LED flash 
but there is no terminal. A debugger fills this gap. As well as allowing you to do step 
through, breakpoint debugging, it allows you to load programs onto your device and 
easily see output. A debugger is a really useful tool for embedded development.

There is a catch though. It is usually a separate device that you connect to your host 
and then wire up to your target device. When you’re first starting out this is a not 
inconsiderable expense and yet another thing that you will have to set up correctly. 
Luckily some devices come with a built-in debugger. With these devices you should be 
able to plug them straight into your host and probe-run your code in a flash. (There is 
usually a bit of setup needed on your host to get the debugger working, ferrous have a 
[good setup guide](https://session20q4.ferrous-systems.com/sessions/installation.html)).


## What board should I get?

All these boards have great HAL and BSP crates, active friendly communities, and an on 
board debugger.

* A [BBC micro:bit](https://www.microbit.org/) (about £13); it is the board used in the new version of the Rust Embedded Discovery book.
* An [nRF52840 Development Kit](https://www.nordicsemi.com/Products/Development-hardware/nRF52840-DK) (about £35); it is the board used in the Knurling Sessions and training by Ferrous Systems.
* An [STM32F3 Discovery Kit](https://www.st.com/en/evaluation-tools/stm32f3discovery.html) (about £14); it is the board used in the first version of the Rust Embedded Discovery book.

### And keep an eye on

* [Raspberry Pi Pico](https://www.raspberrypi.org/products/raspberry-pi-pico/) (about £6 with pre-soldered pins); ARM Cortex-M but no built in debugger and the HAL is still a work in progress. On the other hand, there is a lot of activity on it at the moment and things are moving fast.
* [HiFive1 Rev B](https://www.sifive.com/boards/hifive1-rev-b) (about £50); RISC-V is the new hotness. There seems to be a lot of activity around it in Rust however it does not yet have the support that ARM Cortex-M has right now. Other boards to keep an eye on here are the [Logan Nano](https://longan.sipeed.com/en/) and the [ESP32-C3](https://hackaday.com/2021/02/08/hands-on-the-risc-v-esp32-c3-will-be-your-new-esp8266/).
