#!/usr/bin/env bash

# PeaNUT update script

# This is running on a Raspberry Pi 3B, and it runs a bunch of
# other services. They need to be shutdown during the update
# process, or the build will fail.
# Run as a user with passwordless sudo

# Stop user services then become root for the rest
echo "Stopping resource-intensive services..." && sleep 1
systemctl --user stop satellite openwakeword pulseaudio
echo "Services stopped." && sleep 1
echo "Stopping UPS services..." && sleep 1
sudo systemctl stop peanut nut-monitor nut-server
echo "Services stopped." && sleep 1

# backup current PeaNUT folder
echo "Backing up current PeaNUT installation (please wait)..."
cd /opt && sudo cp -r PeaNUT $HOME/peanut-bkp

echo "Performing update. You should go do something else, this takes a long-ass time..."
cd /tmp
RELEASE=$(curl -s https://api.github.com/repos/Brandawg93/PeaNUT/releases/latest | grep "tag_name" | awk '{print substr($2, 3, length($2)-4) }')
wget "https://github.com/Brandawg93/PeaNUT/archive/refs/tags/v${RELEASE}.zip"
unzip v${RELEASE}.zip
sudo mv PeaNUT-${RELEASE} /opt/PeaNUT
cd /opt/PeaNUT
sudo pnpm i
sudo pnpm run build:local

sudo cp $HOME/peanut-bkp/.next/standalone/config/settings.yml .next/standalone/config/settings.yml
sudo chown -R nut:nut /opt/PeaNUT
echo "Update to PeaNUT version ${RELEASE} complete!" && sleep 3

# Restart services
echo "Restarting services & cleaning up..." && sleep 1
sudo rm -R $HOME/peanut-bkp && sudo rm /tmp/v${RELEASE}.zip
sudo systemctl start nut-server nut-monitor peanut
systemctl --user start openwakeword satellite
# PulseAudio triggers when the Wyoming services resume
echo "Done! Go check on PeaNUT at peanut.cnose.xyz:3000"
