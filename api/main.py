#-*- coding:latin1 -*-

import flask
import json
import vgamepad as vg
import numpy as np
import time

# initialize controller.
#gamepad = vg.VX360Gamepad()
gamepad = vg.VDS4Gamepad()

# initialize server
app = flask.Flask(__name__)
app.config["DEBUG"] = True

# buttons
buttons_pressed = {
  "button_start": "False",
  "button_select": "False",
  "button_left": "False",
  "button_right": "False",
  "button_up": "False",
  "button_down": "False",
  "button_a": "False",
  "button_b": "False",
  "button_x": "False",
  "button_y": "False",
  "button_lb": "False",
  "button_rb": "False",
  "button_lt": "False",
  "button_rt": "False"
}

buttons_mapping_ps4 = {
  "button_a": vg.DS4_BUTTONS.DS4_BUTTON_CROSS,
  "button_b": vg.DS4_BUTTONS.DS4_BUTTON_CIRCLE,
  "button_x": vg.DS4_BUTTONS.DS4_BUTTON_SQUARE,
  "button_y": vg.DS4_BUTTONS.DS4_BUTTON_TRIANGLE,
  "button_lb": vg.DS4_BUTTONS.DS4_BUTTON_SHOULDER_LEFT,
  "button_rb": vg.DS4_BUTTONS.DS4_BUTTON_SHOULDER_RIGHT,
  "button_lt": vg.DS4_BUTTONS.DS4_BUTTON_TRIGGER_LEFT,
  "button_rt": vg.DS4_BUTTONS.DS4_BUTTON_TRIGGER_RIGHT,
  "button_start": vg.DS4_BUTTONS.DS4_BUTTON_OPTIONS,
  "button_select": vg.DS4_BUTTONS.DS4_BUTTON_SHARE,
  "button_left": vg.DS4_DPAD_DIRECTIONS.DS4_BUTTON_DPAD_WEST,
  "button_right": vg.DS4_DPAD_DIRECTIONS.DS4_BUTTON_DPAD_EAST,
  "button_up": vg.DS4_DPAD_DIRECTIONS.DS4_BUTTON_DPAD_NORTH,
  "button_down": vg.DS4_DPAD_DIRECTIONS.DS4_BUTTON_DPAD_SOUTH
}
buttons_mapping_xbox = {
  "button_a": vg.XUSB_BUTTON.XUSB_GAMEPAD_A,
  "button_b": vg.XUSB_BUTTON.XUSB_GAMEPAD_B,
  "button_x": vg.XUSB_BUTTON.XUSB_GAMEPAD_X,
  "button_y": vg.XUSB_BUTTON.XUSB_GAMEPAD_Y,
  "button_lb": vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_SHOULDER,
  "button_rb": vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_SHOULDER,
  "button_lt": vg.XUSB_BUTTON.XUSB_GAMEPAD_LEFT_THUMB,
  "button_rt": vg.XUSB_BUTTON.XUSB_GAMEPAD_RIGHT_THUMB,
  "button_start": vg.XUSB_BUTTON.XUSB_GAMEPAD_START,
  "button_select": vg.XUSB_BUTTON.XUSB_GAMEPAD_BACK,
  "button_left": vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_LEFT,
  "button_right": vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_RIGHT,
  "button_up": vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_UP,
  "button_down": vg.XUSB_BUTTON.XUSB_GAMEPAD_DPAD_DOWN
}

# in order to avoid random spikes,
# every three sensor outputs, the code will average the values
# before updating the controller.
index=0
x=[0,0]
y=[0,0]

# for this method a rather big explanation is necessary.
# So, the sensor always give the values between -x and x, and that works
# well if we only tilt the sensor on one coordinate, like forward
# or left.
# If we mix two coordinates, let's say, we tilt the sensor forward
# and left, then the sensor values on both coordinates max out
# at x/2. And that's accurate because the sensor is never
# at the maximum value of one of the coordinates.
# But for our scenario, that's not ok, because at that situation,
# the controller should be at the max value on both coordinates, which are not.
# To fix that, we need to look the sensor output as a circle
# (because if keep rotating the sensor along the two coordinates, we see the values "form" a circle)
# and convert it into a square (which is the "form" the controller is expecting)
# and that can be done by some equations.
def get_correct_coordinate(a, b):
    # if the sensor is tilted "forward" or "backwards"
    positive_a = 1 if a >= 0 else -1
    # convert to positive to be easier. It's converted to negative if necessary
    # at the end if necessary.
    temp_a = np.abs(a)
    temp_b = np.abs(b)
    # equation
    # a^2+b^2=r^2
    # r=1
    # get max a
    max_a=np.sqrt(1-temp_b**2)
    # get the "a" value for the controller
    real_a = temp_a/max_a
    return real_a * positive_a

# normalize between approximately -1 and 1 
# (its actually -0.98 and 0.98, but close enough)
def normalize_values(x, y):
    new_x = np.floor(x*10)/100
    new_y = np.floor(y*10)/100
    return new_x, new_y

# update controller.
def update_controller(x, y, data):
    left_trigger = 0.0
    right_trigger = 0.0
    if x < -0.1:
        left_trigger = -x
    elif x > 0.1:
        right_trigger = x
    # forward
    gamepad.left_trigger_float(value_float=left_trigger)
    # backward
    gamepad.right_trigger_float(value_float=right_trigger)
    # direction
    gamepad.left_joystick_float(x_value_float=y, y_value_float=0)
    
    for button, value in buttons_pressed.items():
        if value != data[button]:
            buttons_pressed[button] = data[button]
            if data[button]:
                gamepad.press_button(button=buttons_mapping_ps4[button])
            else:
                gamepad.release_button(button=buttons_mapping_ps4[button])
            
    # enter button
    # if enter_button:
    #     gamepad.press_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    # else:
    #     gamepad.release_button(button=vg.XUSB_BUTTON.XUSB_GAMEPAD_A)
    gamepad.update()
    
# receive sensor data.
@app.route('/api/v1/sensors', methods=['POST'])
def sensor_values():
    data = flask.request.get_json()
    global x
    global y
    global index
    x[index] = data["x"]
    y[index] = data["y"]
    index += 1
    # every 3 outputs, update controller
    if index == 2:
        index = 0
        # normalize data between -1 and 1
        normalized_x, normalized_y = normalize_values(np.mean(x), np.mean(y))
        # translate the values 
        correct_y = get_correct_coordinate(-normalized_y, normalized_x)
        correct_x = get_correct_coordinate(normalized_x, -normalized_y)
        update_controller(correct_x, correct_y, data)
    return data

app.run(host="0.0.0.0", port=5000)

