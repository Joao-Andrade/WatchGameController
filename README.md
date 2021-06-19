# WatchGameController

This project allows for anyone with a smartwatch with Tizes OS (for example, Samsung active 2) to control most racing games on a PC as long as both the PC and the smartwatch are connected to the same network.

## How it works

Simply put, the way it works is that the smartwatch sends the gravity sensor values, every 100ms, to the computer through an API, which in turn updates an xbox virtual controller that should control the game's vehicle.

---- diagram showing that ----

When everything is connected and ready to play (check (how to Install)[#how-to-install]), the game should be controlled by doing the following movements (assuming the user has the watch on the wrist).

On my experience, the best starting position (although there may be variations that may be way better/more confortable), is by raising the arm to the side to be on the same level as the shoulder and moving the forearm forward, so it makes a 90º degree angle between the arm and forearm.

---- image showing that ----

 - Speed up or backwards/break:

  To speed up or down, rotate the elbow so that the forearm goes up (speed up) or goes down (go backwards/break).

  ---- image showing that ----

 - direction:

  To turn left or right rotate the elbow so the hand moves closer (left) to the user or further away (right).

  ---- image showing that ----

 And that's it.

## How to install

Before cloning the project, a few things are necessary to make it work.

### Pre requisites

In order to place the app on the smartwatch, it is necessary to have on the PC some sofware:

 - Tizen studio - The software that is used to install the app on the smartwatch. Check [official documentation](https://docs.tizen.org/application/tizen-studio/setup/install-sdk/) on how to install and [configure it to work with the smartwatch](https://docs.tizen.org/application/web/get-started/wearable/first-app/#running-on-a-target-device).
 - Python - The API is written in Python.
   - With the following packages: [vgamepad](https://pypi.org/project/vgamepad/), numpy and flask.
 - ViGEmBus driver - Necessary for the API to create the virtual controller.
   - **NOTE:** It can be installed automatically when installing the vgamepad with pip install.

### Smartwatch app

To place the app on the smartphone, after having conenction between the smartwatch and Tizen Studio ([check official documentation](https://docs.tizen.org/application/web/get-started/wearable/first-app/#running-on-a-target-device)...
