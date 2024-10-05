( function () {

	// initialize some variables.
	var button_home_play = document.getElementById('button-home-play');
	var button_start_element = document.getElementById('button-start');
	var button_select_element = document.getElementById('button-select');
	var button_left_element = document.getElementById('button-left');
	var button_right_element = document.getElementById('button-right');
	var button_up_element = document.getElementById('button-up');
	var button_down_element = document.getElementById('button-down');
	var button_a_element = document.getElementById('button-a');
	var button_b_element = document.getElementById('button-b');
	var button_x_element = document.getElementById('button-x');
	var button_y_element = document.getElementById('button-y');
	var button_lb_element = document.getElementById('button-lb');
	var button_rb_element = document.getElementById('button-rb');
	var button_lt_element = document.getElementById('button-lt');
	var button_rt_element = document.getElementById('button-rt');
	var input_server_address = document.getElementById('input-server-address');
	var input_server_endpoint = document.getElementById('input-server-endpoint');
	// request to server initializations.
	var setup_mode_xhttp;
	setup_mode_xhttp=new XMLHttpRequest();
	setup_mode_xhttp.responseType = 'json';
	// if it should send data to server or not.
	var send_data = false;
	// Buttons pressed.
	var button_start = false;
	var button_select = false;
	var button_left = false;
	var button_right = false;
	var button_up = false;
	var button_down = false;
	var button_a = false;
	var button_b = false;
	var button_x = false;
	var button_y = false;
	var button_lb = false;
	var button_rb = false;
	var button_lt = false;
	var button_rt = false;
	
	// initialize sensor function.
	function onSensorStart()
	{
	  console.log("Gravity sensor started.");
	}
	// what happens when the collects sensor data.
	function onGetSensorSuccess(sensorData)
	{
		if (!send_data) {
			return false;
		}
		setup_mode_xhttp.open("POST", input_server_address.value);
		setup_mode_xhttp.setRequestHeader("Content-Type", "application/json");
		setup_mode_data = JSON.stringify(
				{
					"x": parseFloat(sensorData.x),
					"y": parseFloat(sensorData.y),
					"z": parseFloat(sensorData.z),
					"button_start": button_start,
					"button_select": button_select,
					"button_left": button_left,
					"button_right": button_right,
					"button_up": button_up,
					"button_down": button_down,
					"button_a": button_a,
					"button_b": button_b,
					"button_x": button_x,
					"button_y": button_y,
					"button_lb": button_lb,
					"button_rb": button_rb,
					"button_lt": button_lt,
					"button_rt": button_rt
				});
		setup_mode_xhttp.send(setup_mode_data);
	}
	
	// sensor had an error.
	function onGetSensorError(error)
	{
		console.log("Error occurred: " + error.message);
	}

	// initialize sensor.
	var gravitySensor = tizen.sensorservice.getDefaultSensor("GRAVITY");
	gravitySensor.start(onSensorStart, onGetSensorError);
	gravitySensor.setChangeListener(onGetSensorSuccess, 100);
	
	// buttons actions
	button_home_play.addEventListener('click', function() {
		send_data = !send_data;
		button_home_play.innerHTML = send_data ? "Stop" : "Play"
	});
	button_start_element.addEventListener('click', function() {
		button_start = !button_start;
	});
	button_select_element.addEventListener('click', function() {
		button_select = !button_select;
	});
	button_up_element.addEventListener('click', function() {
		button_up = !button_up;
	});
	button_down_element.addEventListener('click', function() {
		button_down = !button_down;
	});
	button_left_element.addEventListener('click', function() {
		button_left = !button_left;
	});
	button_right_element.addEventListener('click', function() {
		button_right = !button_right;
	});
	button_a_element.addEventListener('click', function() {
		button_a = !button_a;
	});
	button_b_element.addEventListener('click', function() {
		button_b = !button_b;
	});
	button_x_element.addEventListener('click', function() {
		button_x = !button_x;
	});
	button_y_element.addEventListener('click', function() {
		button_y = !button_y;
	});
	button_lb_element.addEventListener('click', function() {
		button_lb = !button_lb;
	});
	button_rb_element.addEventListener('click', function() {
		button_rb = !button_rb;
	});
	button_lt_element.addEventListener('click', function() {
		button_lt = !button_lt;
	});
	button_rt_element.addEventListener('click', function() {
		button_rt = !button_rt;
	});
	
	// exits stuffs
	window.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName === "back" ) {
			var page = document.getElementsByClassName( 'ui-page-active' )[0],
			pageid = page ? page.id : "";
			if( pageid === "main" ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	} );
} () );
