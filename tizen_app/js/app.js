( function () {

	// initialize some variables.
	var button_home_play = document.getElementById('button-home-play');
	var input_server_address = document.getElementById('input-server-address');
	var input_server_endpoint = document.getElementById('input-server-endpoint');
	// request to server initializations.
	var setup_mode_xhttp;
	setup_mode_xhttp=new XMLHttpRequest();
	setup_mode_xhttp.responseType = 'json';
	// if it should send data to server or not.
	var send_data = false;
	
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
		setup_mode_data = JSON.stringify({"x": parseFloat(sensorData.x), "y": parseFloat(sensorData.y), "z": parseFloat(sensorData.z)});
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