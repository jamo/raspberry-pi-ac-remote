# WIP

## Setup on raspberry-pi 4

Install `lirc` `sudo apt install lirc`


### One time initial setup
This section tries to cover all the changes/configs neccessary, this is heavily inspired from https://github.com/raspberrypi/linux/issues/2993#issuecomment-497420228

in `/boot/config.txt` add

```
dtoverlay=gpio-ir,gpio_pin=23
dtoverlay=gpio-ir-tx,gpio_pin=22
```


Add rule to make stable device names `/etc/udev/rules.d/71-lirc.rules`

```
ACTION=="add", SUBSYSTEM=="lirc", DRIVERS=="gpio_ir_recv", SYMLINK+="lirc-rx"
ACTION=="add", SUBSYSTEM=="lirc", DRIVERS=="gpio-ir-tx", SYMLINK+="lirc-tx"
ACTION=="add", SUBSYSTEM=="lirc", DRIVERS=="pwm-ir-tx", SYMLINK+="lirc-tx"
```

Edit `/etc/lirc/lirc_options.conf`
with 
```
device          = /dev/lirc-rx
listen          = 0.0.0.0:8766
```

Copy `lirc_options.conf` to `lirc_tx_options.conf` and edit these lines:

```
device          = /dev/lirc-tx
output          = /var/run/lirc/lircd-tx
pidfile         = /var/run/lirc/lircd-tx.pid
listen          = 0.0.0.0:8765
connect         = 127.0.0.1:8766
```

Create `/etc/systemd/system/lircd-tx.service` (from the output of `systemctl cat lircd`) and edit it to be:

```
# /lib/systemd/system/lircd.service
[Unit]
Documentation=man:lircd(8)
Documentation=http://lirc.org/html/configure.html
Description=Flexible IR remote input/output application support
Wants=lircd-setup.service
After=network.target lircd-setup.service

[Service]
Type=notify
ExecStart=/usr/sbin/lircd --nodaemon --options-file /etc/lirc/lirc_tx_options.conf
; User=lirc
; Group=lirc

; Hardening opts, see systemd.exec(5). Doesn't add much unless
; not running as root.
;
; # Required for dropping privileges in --effective-user.
; CapabilityBoundingSet=CAP_SETEUID
; MemoryDenyWriteExecute=true
; NoNewPrivileges=true
; PrivateTmp=true
; ProtectHome=true
; ProtectSystem=full

[Install]
WantedBy=multi-user.target
```

Create `/etc/systemd/system/lircd-tx.socket` (from the output of `systemctl cat lircd.socket`) and edit it:

```
[Socket]
ListenStream=/run/lirc/lircd-tx

[Install]
WantedBy=sockets.target
Also=lircd-tx.service
```

Start lircd-tx:

```
sudo systemctl daemon-reload
sudo systemctl start lircd-tx
sudo systemctl enable lircd-tx
```



### Recording commands

We don't need to reverse the protocol, we can simply record the commands we care about:

`sudo mode2  -d /dev/lirc-rx | tee heat_23`

And then TODO process these and generate config `/etc/lirc/lircd.conf.d/pi.lircd.conf`

```
begin remote

  name  PI
  flags RAW_CODES
  eps            30
  aeps          100

  gap          450
  frequency    38000

      begin raw_codes
	name HEAT_AUTO_23
            4428 4418 560 1606 554 1611
	    < snip >
            549 1610 560 1602 557
            538 560
      end raw_codes
end remote
```


And now we can send the command with `sudo /usr/bin/irsend --device=/var/run/lirc/lircd-tx  SEND_ONCE PI HEAT_AUTO_23`



