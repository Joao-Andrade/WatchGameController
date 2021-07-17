# WatchGameController

This project allows for anyone with a smartwatch with Tizes OS (for example, Samsung active 2) to control most racing games on a PC as long as both the PC and the smartwatch are connected to the same network.

## How it works

Simply put, the way it works is that the smartwatch sends the gravity sensor values, every 100ms, to the computer through an API, which in turn updates an xbox virtual controller that should control the game's vehicle.

![Diagram](documentation/GameControllerDiagram.png)

When everything is connected and ready to play (check (how to Install)[#how-to-install]), the game should be controlled by doing the following movements (assuming the user has the watch on the wrist).

On my experience, the best starting position (although there may be variations that may be way better/more confortable), is by raising the arm to the side to be on the same level as the shoulder and moving the forearm forward, so it makes a 90º degree angle between the arm and forearm.

---- image showing that ----

 - Speed up or backwards/break:

  To speed up or down, rotate the elbow so that the forearm goes up (speed up) or goes down (go backwards/break).

  ---- image showing that ----

 - direction:

  To turn left or right rotate the elbow so the hand moves closer (left) to the user or further away (right).

  ---- image showing that ----

 And that's it. This simulates the controller thumbstick (direction) and the back triggers (speed and break) so the car reflects the user actions.

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

After having conenction between the smartwatch and Tizen Studio ([check pre requisites](#pre-requisites), in the Tizen Studio menu, select "File > Import". Select "Tizen > Tizen Project", click "Next" and select the folder from this github project "tizen_app". Click "Next" and select the "WatchGameController" project and click "Finish" to import it. The project should appear on the project explorer of Tizen Studio and the code can be analysed/changed from there.

[!import_project](documentation/import_project.png)
