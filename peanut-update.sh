#!/usr/bin/env bash

# PeaNUT update script

# This is running on a Raspberry Pi 3B, and it runs a bunch of
# other services. They need to be shutdown during the update
# process, or the build will fail.
# Run as a user with sudo

# Stop user services then become root for the rest
systemctl --user stop satellite openwakeword pulseaudio
sudo bash
systemctl stop nut-monitor nut-server peanut

# backup current PeaNUT folder
cd /opt && cp r PeaNUT $HOME/peanut-bkp

cd /opt/PeaNUT
git pull
pnpm i
pnpm run build:local
# This all takes a reallll long time

# Then I might have to grab the config file from the backup
# (I heard the update deletes the config)

cp $HOME/peanut-bkp/.next/standalone/config/settings.yml .next/standalone/config/settings.yml

# Restart services
systemctl start nut-server nut-monitor peanut
exit
systemctl --user start openwakeword satellite pulseaudio

# TODO: check on Pulseaudio service
