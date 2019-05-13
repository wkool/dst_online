/**
* jspsych-dst-stim
* Wouter Kool
*
* plugin for practicing an online version of the demand selection task (Kool et al., 2010, JEPG)
*
**/

(function($) {
	jsPsych["practice-switching-stim"] = (function() {

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
				trials[i].feedback = params.feedback || false;
				//trials[i].trialsperblock = params.trialsperblock;
				//trials[i].nrblocks = params.nrblocks;
								
				// timing parameters
				trials[i].postStimulusTime = params.postStimulusTime || 500;
				trials[i].feedbackTime = params.feedbackTime || 750;
				
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
			
			var number = -1;
			
			if (trial.feedback){
				var feedbackTime = trial.feedbackTime;
			} else {
				feedbackTime = 0;
			}
			
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
					"color": colorindex,
					"number": number,
					"response": response.key,
					"accuracy": accuracy,
					"rt": response.rt
				};
				
				jsPsych.data.write(trial_data);
				
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
					
					
					if (trial.feedback) {
						$('#jspsych-dst-box2').css('background-position','center top');
						if (accuracy) {
							$('#jspsych-dst-box2').css('background-image', 'url("img/checkmark.png")');
						} else {
							$('#jspsych-dst-box2').css('background-image', 'url("img/cross.png")');
						}
					}
											
					var handle_feedback = setTimeout(function() {
						$('#jspsych-dst-box1').html('');
						$('#jspsych-dst-box2').css('background-image', '');
						var handle_postStimulus = setTimeout(function() {
							end_trial();
						}, trial.postStimulusTime);
						setTimeoutHandlers.push(handle_postStimulus);
					}, feedbackTime);
					setTimeoutHandlers.push(handle_feedback);
					
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
					style: 'clear:both',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box1',
				}));
				display_element.append($('<div>', {
					style: 'clear:both',
				}));
				display_element.append($('<div>', {
					id: 'jspsych-dst-box2',
				}));
				$('#jspsych-dst-box1').append(number)
				$('#jspsych-dst-box1').css('color', 'rgb('+color[0]+','+color[1]+','+color[2]+')');								
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
				
				while ((number == -1)||(number == 5)){
					number = Math.ceil(Math.random()*9);
				}
				
				if (Math.random()<0.5) {
					colorindex = Math.abs(prevcolorindex-1);
				} else {
					colorindex = prevcolorindex;
				}
				
				color = colors[colorindex];
				prevcolorindex = colorindex;
								
				display_stimuli();
							
				start_response_listener();
				
			}			
			
			next_trial();
			
		};
		
		return plugin;
		
	})();
})(jQuery);