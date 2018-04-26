window.$on = function(target, event, cb){
	target.addEventListener(event, cb, false);
}


var CORE = (function(){

	var modules = {};

function addModules(module_id, mod){
	modules[module_id] = mod;
}
function registerEvents(module_id, evt){
	var theMod = modules[module_id];
	theMod.events = evt;
}
function triggerEvents(evt){
	var mod;
	for(mode in modules){
		if(modules.hasOwnProperty(mode)){
			mod = modules[mode];

			if(mod.events && mod.events[evt.type]){
				mod.events[evt.type](evt.data);
			}
		}
	}
}
return{
	addModules: addModules,
	registerEvents: registerEvents,
	triggerEvents: triggerEvents
}
})();

var sb = (function(){
	function listen(module_id, mod){
		CORE.registerEvents(module_id, mod);
	}

	function notify(evt){
		CORE.triggerEvents(evt);
	}

	return {
		listen: listen,
		notify: notify
	}
}());

var cel = (function(){

	var id, celsius, fahrenheit, add;

	id = 'celsius';

	function init(){
		celsius = document.getElementsByClassName('celsius')[0];
		fahrenheit = document.getElementsByClassName('fahrenheit')[0];
		add = document.getElementsByClassName('submit')[0];

		$on(add, 'click', convertCelsius);

		sb.listen(id, {'fahrenheit-temp': displayCelsius});
	}
	function convertCelsius(e){
		var calculate = {};

		calculate.fahrenheit = ((celsius.value * 9)/5) + 32;

		sb.notify({
			type: 'celsius-temp',
			data: calculate
		});
		
		e.preventDefault();
	}

	function displayCelsius(conversion){
		celsius.value = conversion.celsius;
		console.log(celsius.value);
	}
	return {
		id: id,
		init: init, 
		displayCelsius: displayCelsius
	}
})();

var fahr = (function(){

	var id, celsius, fahrenheit, add;

	id = 'fahrenheit';


	function init(){
		celsius = document.getElementsByClassName('celsius')[0];
		fahrenheit = document.getElementsByClassName('fahrenheit')[0];
		add = document.getElementsByClassName('submit2')[0];

		$on(add, 'click', convertFahrenheit);

		sb.listen(id, {'celsius-temp': displayFahrenheit});
	}
	function convertFahrenheit(e){
		var calculate = {};

		calculate.celsius = ((fahrenheit.value - 32)*5)/9;


		sb.notify({
			type: 'fahrenheit-temp',
			data: calculate
		});
		
		e.preventDefault();
	}

	function displayFahrenheit(conversion){
		fahrenheit.value = conversion.fahrenheit;
	}
	return {
		id: id,
		init: init, 
		displayFahrenheit: displayFahrenheit
	}
})();

CORE.addModules(cel.id, cel);
CORE.addModules(fahr.id, fahr);

cel.init();
fahr.init();