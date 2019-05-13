var instructions_1_text = function(){
	var instructions = ["<div align=center>Welcome to this HIT!<br><br>Please read all following instructions very carefully.<br><br>It takes some time, but otherwise you will not know what to do.</div>",
	"<div align=center>In this HIT, you will make judgments about numbers.<br><br>Every time, you will see a number from 1 to 9 on the screen.<br><br>You will then respond using the A and the S keys on the keyboard.</div>", 
	"<div align=justify>The correct response to each number depends on the color it appears in, which could be yellow or blue.<br><br>If the number is yellow, you have to decide if it's odd or even. Press the left key (A) for odd, and the right key (S) for even.<br><br>If the number is blue, you have to decide if it's lower or higher than five. Press the left button (A) for low, and the right button (S) for high.</div>",
	"<div align=center>Now, you will practice this task.<br><br>You can respond to this first set of practice numbers at your own pace.</div>"];
	return instructions
};

var instructions_2_text = function(){
	var instructions = ["<div align=center>In the next round of practice you won't get immediate feedback about your accuracy.<br><br>Instead, you'll get cumulative feedback every 10 trials.</div>"];
	return instructions
}

var instructions_3_text = function(){
	var instructions = ["<div align=justify>In the next part, you will see two colored patches on the screen and use the mouse to select one of them. This will look like this:<br><br><img style='margin:0px auto;display:block;height:150px' src='img/example1.png'/><br>The selected patch will then show you a blue or yellow number, which you should respond to in the way you've been practicing.</div>",
	"<div align=justify>On each trial, you will first move the mouse to the black and white bullseye. Then, you move it to one of the two patches (and respond to the number).<br><br>You will now perform a couple of trials to get a feel for how this will work.</div>",];
	return instructions
}

var instructions_4_text = function(){
	var instructions = ["<div align=justify>There are 4 blocks in the experiment, and each block starts with a new pair of patches. You should always begin by sampling them both randomly.<br><br>You may notice differences between them. If you develop a preference, you can feel free to choose one patch more than the other.</div>",
	"<div align=justify>Please avoid using simple rules such as alternating back and forth between the patches. Instead, try to make a decision on every trial.<br><br>The HIT will start after you press 'next', make sure you have your fingers on the A and the S keys! Good luck!</div>"];
	return instructions
}
	


function createMemberInNormalDistribution(mean,std_dev){
	return mean + (gaussRandom()*std_dev);
}
/*
* Returns random number in normal distribution centering on 0.
* ~95% of numbers returned should fall between -2 and 2
*/
function gaussRandom() {
	var u = 2*Math.random()-1;
	var v = 2*Math.random()-1;
	var r = u*u + v*v;
	/*if outside interval [0,1] start over*/
	if(r == 0 || r > 1) return gaussRandom();

	var c = Math.sqrt(-2*Math.log(r)/r);
	return u*c;

	/* todo: optimize this algorithm by caching (v*c) 
	* and returning next time gaussRandom() is called.
	* left out for simplicity */
}

function shuffle(o){
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

var images = [
'img/p_patch_0.png',
'img/p_patch_0.png',
'img/patch1_0.png',
'img/patch1_1.png',
'img/patch2_0.png',
'img/patch2_1.png',
'img/patch3_0.png',
'img/patch3_1.png',
'img/patch4_0.png',
'img/patch4_1.png',
'img/p_patch_0_off.png',
'img/p_patch_1_off.png',
'img/patch1_0_off.png',
'img/patch1_1_off.png',
'img/patch2_0_off.png',
'img/patch2_1_off.png',
'img/patch3_0_off.png',
'img/patch3_1_off.png',
'img/patch4_0_off.png',
'img/patch4_1_off.png',
'img/p_patch_0_stim.png',
'img/p_patch_1_stim.png',
'img/patch1_0_stim.png',
'img/patch1_1_stim.png',
'img/patch2_0_stim.png',
'img/patch2_1_stim.png',
'img/patch3_0_stim.png',
'img/patch3_1_stim.png',
'img/patch4_0_stim.png',
'img/patch4_1_stim.png',
'img/home.png',
'img/home_off.png',
'img/example1.png',
];

function save_data(data,table_name){
	
for (i = 0; i < data.length; i++) {
	delete data[i].internal_chunk_id;
	delete data[i].trial_index_global;
	delete data[i].trial_type;
	/*if (table_name == "space_mult_subinfo") {
		delete data[i].key_press;
		delete data[i].rt;
		delete data[i].trial_index;
		}*/
	}
		
	$.ajax({
		type:'post',
		cache: false,
		url: 'savedata.php', // change this to point to your php file.
		// opt_data is to add additional values to every row, like a subject ID
		// replace 'key' with the column name, and 'value' with the value.
		data: {
			table: table_name,
			json: JSON.stringify(data),
		},
		success: function(){
			console.log("hieperdepiep");
		}// write the result to javascript console
		//success: function(output) { console.log(output); } // write the result to javascript console
	});
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}