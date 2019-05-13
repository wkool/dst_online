/**
* jspsych-dst-stim
* Wouter Kool
*
* plugin for practicing an online version of the demand selection task (Kool et al., 2010, JEPG)
*
**/

(function($) {
	jsPsych["dst-practice-stim"] = (function() {

		var plugin = {};
		
		//var score = 0;
		
		var prevcolorindex = Math.round(Math.random());
		
		//var displayColor = '#0738db';
		//var borderColor = '#197bff';
		//var textColor = '#b8fff6';
		
		plugin.create = function(params) {

			params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);
			
			var trials = new Array(params.nrtrials);
			
			for (var i = 0; i < trials.length; i++) {
				
				trials[i] = {};
				trials[i].practice = params.practice || 0;
				trials[i].subid = params.subid;
				//trials[i].fixed_time = params.fixed_time || false;
				
				trials[i].index = i;
				
				// timing parameters
				trials[i].postStimulusTime = params.postStimulusTime || 500;
				
			}
			return trials;
			
		};
		
		plugin.trial = function(display_element, trial) {
			
			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function
			
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
			
			// store responses
			var block = Math.floor((trial.index)/trial.trialsperblock);
			
			var pause = 0;
			
			var setTimeoutHandlers = [];
			
			var keyboardListener = new Object;	
				
			var response = {rt: -1, key: -1};
			
			var mapping = [0, 1];
			var boxes = [3,4];
			
			var chosen = -1;
			var unchosen = -1;
			var number = -1;
			
			var colorindex = -1;
			//var prevcolorindex = Math.round(Math.random());
			
			var accuracy = -1;
			
			var colors = [
				[252, 213, 38],
				[29,85,149]
			];
			
			var both_choices = [["A","S"],["space"]];
			var choices = new Array;
			
			// function to end trial when it is time
			var end_trial = function(){
				
				kill_listeners();
				kill_timers();
								
				// gather the data to store for the trial
				
				var trial_data = {
					"subid": trial.subid,
					"lowdemand": mapping[chosen],
					"color": colorindex,
					"number": number,
					"response": response.key,
					"accuracy": accuracy,
					"rt": response.rt,
					"practice": true,
					"box1": boxes[0],
					"box2": boxes[1],
					"pair": 0,
					"mapping1": mapping[0],
					"mapping2": mapping[1],
				};
				
				jsPsych.data.write(trial_data);
				display_element.html('');
				jsPsych.finishTrial();
				
			};
			
			// function to handle responses by the subject
			var after_response = function(info){
				
				kill_listeners();
				kill_timers();
				
				if (pause == 0) {
										
					if (response.key == -1){
						response = info;
					}
					
					// 65 left, 83 right
					if (colorindex == 0) { // yellow, parity
						if (response.key == 65) { // left response
							accuracy = (number%2)==1;
						} else {
							accuracy = Math.abs((number%2)-1)==1;
						}
					} else { // blue magnitude
						if (response.key == 65) { // left response
							accuracy = (number<5);
						} else {
							accuracy = (number>5);
						}
					}
					
					$('#jspsych-dst-box'+boxes[chosen]).html('');
					
					var handle_postStimulus = setTimeout(function() {
						end_trial();
					}, trial.postStimulusTime);
					setTimeoutHandlers.push(handle_postStimulus);
					
				} else {
					
					pause = 0;
					
					next_trial();
					
				}
				
								
			};
			
			var display_stimuli = function(){
				
				display_element.html('');
				
				//display_element.css('cursor','auto');
				
				display_element.append($('<div>', {
					id: 'jspsych-dst-box0',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box1',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box2',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box0',
				}));
				display_element.append($('<div>', {
					style: 'clear:both',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-center-left',
				}));
				$('#jspsych-dst-center-left').append($('<div id="jspsych-dst-center-fill"></div><div id="jspsych-dst-box3"></div>'))
				display_element.append($('<div>', {
					id: 'jspsych-dst-center-stim',
				}));
				$('#jspsych-dst-center-stim').append($('<div id="jspsych-dst-center-topbottom"></div><div id="jspsych-dst-center-center"></div><div id="jspsych-dst-center-topbottom"></div>'))
				display_element.append($('<div>', {
					id: 'jspsych-dst-center-right',
				}));
				$('#jspsych-dst-center-right').append($('<div id="jspsych-dst-center-fill"></div><div id="jspsych-dst-box4"></div>'))
				display_element.append($('<div>', {
					style: 'clear:both',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box0',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box7',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box8',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box0',
				}));
										
				$('#jspsych-dst-box3').css('background-image', 'url("img/p_patch_0_off.png")');
				$('#jspsych-dst-box4').css('background-image', 'url("img/p_patch_1_off.png")');
				$('#jspsych-dst-center-center').css('background-image', 'url("img/home.png")');
									
			}
			
			var start_response_listener = function(){
				
				if (pause == 0) {
					choices = both_choices[0];
				} else {
					choices = both_choices[1];
				}
						
				if(JSON.stringify(choices) != JSON.stringify(["none"])) {
					var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
						callback_function: after_response,
						valid_responses: choices,
						rt_method: 'date',
						persist: false,
						allow_held_key: false,
					});
				}
				
			}
			
			var kill_timers = function(){
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}
			}
			
			var kill_listeners = function(){
				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined'){
					jsPsych.pluginAPI.cancelAllKeyboardResponses();
					//jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				}
			}
			
			var next_trial = function(){
								
				kill_timers();
				kill_listeners();
								
				display_stimuli();
								
				$('#jspsych-dst-center-center').on('mouseover', function() {
					$('#jspsych-dst-center-center').off('mouseover');
					$('#jspsych-dst-center-center').css('background-image', 'url("img/home_off.png")');
					$('#jspsych-dst-box'+boxes[0]).css('background-image', 'url("img/p_patch_0.png")');
					$('#jspsych-dst-box'+boxes[1]).css('background-image', 'url("img/p_patch_1.png")');
						
					$('#jspsych-dst-box'+boxes[0]).on('mouseover', function() {
						chosen = 0;
						patchChosen();
					});
					$('#jspsych-dst-box'+boxes[1]).on('mouseover', function() {
						chosen = 1;
						patchChosen();
					});
						
					var patchChosen = function(){
						unchosen = Math.abs(chosen-1);
						$('#jspsych-dst-box'+boxes[0]).off('mouseover');
						$('#jspsych-dst-box'+boxes[1]).off('mouseover');
						$('#jspsych-dst-box'+boxes[unchosen]).css('background-image', 'url("img/p_patch_'+unchosen+'_off.png")');
						$('#jspsych-dst-box'+boxes[chosen]).css('background-image', 'url("img/p_patch_'+chosen+'_stim.png")');
						
						//chose number
						while ((number == -1)||(number == 5)){
							number = Math.ceil(Math.random()*9);
						}
						
						p = Math.random();
						
						if (mapping[chosen] == 0) { //high demand
							if (p<0.9) {
								colorindex = Math.abs(prevcolorindex-1);
							} else {
								colorindex = prevcolorindex;
							}
						} else { // low demand
							if (p<0.9) {
								colorindex = prevcolorindex;
							} else {
								colorindex = Math.abs(prevcolorindex-1);
							}
						}
						
						color = colors[colorindex];
						prevcolorindex = colorindex;
						$('#jspsych-dst-box'+boxes[chosen]).append(number)
						$('#jspsych-dst-box'+boxes[chosen]).css('color', 'rgb('+color[0]+','+color[1]+','+color[2]+')');
						start_response_listener();
					};
				});
				
				
			}			
									
			if ((trial.practice==1)||(trial.index==0)||(trial.index%trial.trialsperblock != 0)){
				next_trial();
			} else {
				pause = 1;
				display_element.html('');
				display_element.append($('<div>', {
					html: '<br><br>You completed block '+((trial.index)/trial.trialsperblock)+'/'+trial.nrblocks+'. You can take a break now.<br><br>- press space to continue -',
				}));
				start_response_listener();
			}
			
		};
		
		return plugin;
		
	})();
})(jQuery);
