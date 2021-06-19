( function () {

	var setup_mode_xhttp;
	setup_mode_xhttp=new XMLHttpRequest();
	setup_mode_xhttp.responseType = 'json';
	function onSensorStart()
	{
	  console.log("Gravity sensor started.");
	}
	function onGetSensorSuccess(sensorData)
	{
		setup_mode_data = JSON.stringify({"reset": false, "x": parseInt(sensorData.x * 100), "y": parseInt(sensorData.y * 100), "z": parseInt(sensorData.z * 100)});
		setup_mode_xhttp.send(setup_mode_data);
	}
	function onGetSensorError(error)
	{
		console.log("Error occurred: " + error.message);
	}
	var sensors = tizen.sensorservice.getAvailableSensors();
	console.log('Available sensor: ' + sensors.toString());

	var gravitySensor = tizen.sensorservice.getDefaultSensor("ACCELERATION");
	gravitySensor.start(onSensorStart, onGetSensorError);
	var setup_complete = false;
	var setup_ongoing = false;
	// buttons
	var button_home_setup = document.getElementById('button-home-setup');
	var button_home_play = document.getElementById('button-home-play');
	var button_setup_mode = document.getElementById('button-setup-mode');
	var button_play_mode = document.getElementById('button-play-mode');
	// texts
	var text_setup_mode = document.getElementById('text-setup-mode');
	var text_play_mode = document.getElementById('text-play-mode');
	// buttons actions
	button_home_setup.addEventListener('click', function() {
		if (setup_complete) {
			text_setup_mode.innerHTML = "Setup already completed";
			button_setup_mode.innerHTML = "Setup again";
		};
		tau.changePage("#setup_page");
	});
	button_setup_mode.addEventListener('click', function() {
		if (setup_complete && button_setup_mode.innerHTML == "Setup again") {
			setup_ongoing = false;
			setup_complete = false;
			text_setup_mode.innerHTML = "Please setup device";
			button_setup_mode.innerHTML = "start setup";
		}
		if (!setup_complete && !setup_ongoing){
			setup_mode_xhttp.open("POST", "http://192.168.1.20:5000/api/v1/setup_sensors");
			setup_mode_xhttp.setRequestHeader("Content-Type", "application/json");
			setup_mode_data = JSON.stringify({"reset": true});
			setup_mode_xhttp.onload  = function() {
				if (setup_mode_xhttp.status != 200) {
					text_setup_mode.innerHTML = "Something went wrong. Try again.";
					button_setup_mode.innerHTML = "start setup";
					return false;
				}
				var jsonResponse = setup_mode_xhttp.response;
				console.log(JSON.stringify(jsonResponse));
				text_setup_mode.innerHTML = jsonResponse.Message + "<br/>Repetitions left: " + jsonResponse.repetitions_left;
				button_setup_mode.innerHTML = "Send sensor data";
				setup_ongoing = true;
			};
			setup_mode_xhttp.send(setup_mode_data);
		} else if (setup_ongoing) {
			setup_mode_xhttp.open("POST", "http://192.168.1.20:5000/api/v1/setup_sensors");
			setup_mode_xhttp.setRequestHeader("Content-Type", "application/json");
			setup_mode_xhttp.onload  = function() {
				if (setup_mode_xhttp.status != 200) {
					text_setup_mode.innerHTML = "Something went wrong. Try again.";
					return false;
				}
				var jsonResponse = setup_mode_xhttp.response;
				if (jsonResponse.Completed) {
					setup_ongoing = true;
					setup_complete = true;
					text_setup_mode.innerHTML = "Setup completed. Feel free to return to the previous menu.";
					button_setup_mode.innerHTML = "Setup again";
					return true;
				};
				console.log(JSON.stringify(jsonResponse));
				text_setup_mode.innerHTML = jsonResponse.Message + "<br/>Repetitions left: " + jsonResponse.repetitions_left;
			};
			gravitySensor.getGravitySensorData(onGetSensorSuccess, onGetSensorError);
		};
	});
	button_home_play.addEventListener('click', function() {
		tau.changePage("#play_page");
	});
	button_play_mode.addEventListener('click', function() {
		console.log("A")
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