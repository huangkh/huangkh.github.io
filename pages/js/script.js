//grid width and height
var bw = 500;
var bh = 500;

var canvas = $('<canvas/>').attr({width: bw, height: bh}).prependTo('body');
var context = canvas.get(0).getContext("2d");


var array = [];//0 -> death, 1 -> life， 2 -> wall
var auxArray = [];//equals the number of lives around
var wallArray = [];//0 -> no wall, 1 -> wall

var num_row = 50;
var num_col = 50;

var gw = bw / num_col;//the width of each grid
var gh = bh / num_row;//the height of each grid

var auto;
var auto_flag;//0 -> not in auto, 1 -> auto

var fps = 5;//times for updating the map per second

var density = 1200;
var density_live;
var density_death;

function initGrid(){
	pause();
	density_live = density;
	density_death = num_row * num_col - density;
	
	for(var i = 0; i < num_row*num_col; i++){
		
		if(density_live > 0 && density_death > 0){
			array[i] = Math.floor(Math.random() * 2);
		}else if(density_live > 0){
			array[i] = 1;
		}else if(density_death > 0){
			array[i] = 0;
		}
		if(array[i] === 1)
			density_live--;
		else if(array[i] === 0)
			density_death--;
		
		auxArray[i] = 0;
		wallArray[i] = 0;
	}
	
	drawGrid();
	
}

canvas.mousedown(function(e){
	//var bbox = canvas.getBoundingClientRect();
	var x = e.pageX - this.offsetLeft; //bbox.left * (canvas.width / bbox.width);
	var y = e.pageY - this.offsetTop; //bbox.top * (canvas.height / bbox.height);
	var x_num = (x - x % gw) / gw;
	var y_num = (y - y % gh) / gh;
	wallArray[y_num * num_col + x_num] = 1 - wallArray[y_num * num_col + x_num];
	if(wallArray[y_num * num_col + x_num] === 1)
		array[y_num * num_col + x_num] = 2;
	else
		array[y_num * num_col + x_num] = 2 - array[y_num * num_col + x_num];
	drawGrid();
})



function drawGrid(){
		
	for(var i = 0; i < num_row; i++){
		for(var j = 0;j < num_col; j++){
			if(array[num_col*i + j] === 1){
				context.fillStyle = 'green';
				context.fillRect(gw*j, gh*i, gw, gh);	
			}
			else if(array[num_col*i + j] === 0){
				context.fillStyle = 'white';
				context.fillRect(gw*j, gh*i, gw, gh);
			}else {
				context.fillStyle = 'black';
				context.fillRect(gw*j, gh*i, gw, gh);
			}
		}
	}
	
	context.moveTo(0, 0);
	context.lineTo(bw, 0);
	context.lineTo(bw, bh);
	context.lineTo(0, bh);
	context.lineTo(0, 0);
	context.stroke();
	
}

function update(){
	for(var i = 0; i < num_row*num_col; i++){
		/*
		var left_top = (array[i-num_col-1] === undefined) ? 0 : array[i-num_col-1];
		var top = (array[i-num_col] === undefined) ? 0 : array[i-num_col];
		var right_top = (array[i-num_col+1] === undefined) ? 0 : array[i-num_col+1];
		var left = (array[i-1] === undefined) ? 0 : array[i-1];
		var right = (array[i+1] === undefined) ? 0 : array[i+1];
		var left_bottom = (array[i+num_col-1] === undefined) ? 0 : array[i+num_col-1];
		var bottom = (array[i+num_col] === undefined) ? 0 : array[i+num_col];
		var right_bottom = (array[i+num_col+1] === undefined) ? 0 : array[i+num_col+1];

		var sum = left_top + top + left_bottom + left + right + bottom + right_bottom + right_top;
		*/
		var y = (i - i % num_col) / num_col; //from 0 to num_row-1
		var x = i % num_col;//from 0 to num_col-1
		
		var top_top = (y < 2) ? 0 : (array[i-num_col*2] === 2  ? 0:array[i-num_col*2]);
		var top = (y < 1) ? 0 : (array[i-num_col] === 2  ? 0:array[i-num_col]);
		var left_left = (x < 2) ? 0 : (array[i-2] === 2  ? 0:array[i-2]);
		var left = (x < 1) ? 0 : (array[i-1] === 2  ? 0:array[i-1]);
		var right = (x > num_col-2) ? 0 : (array[i+1] === 2  ? 0:array[i+1]);
		var right_right = (x > num_col-3) ? 0 : (array[i+2] === 2  ? 0:array[i+2]);
		var bottom = (y > num_row-2) ? 0 : (array[i+num_col] === 2  ? 0:array[i+num_col]);
		var bottom_bottom = (y > num_row-3) ? 0 : (array[i+num_col*2] === 2  ? 0:array[i+num_col*2]);

		var sum = top_top + top + left_left + left + right + right_right + bottom + bottom_bottom;
		

		auxArray[i] = sum;
	}

	for(var i = 0; i < num_row*num_col; i++){
		if(array[i] === 2){
			continue;
		}else if(auxArray[i] == 3){
			array[i] = 1;
		}
		else if(auxArray[i] == 2){
			//
		}
		else{
			array[i] = 0;
		}
	}

	drawGrid();
}

function play(){
	var t = 1000 / fps;
	if(auto_flag === 0){
		auto = setInterval(update, t);
		auto_flag = 1;
	}
	
}

function reinitGrid(){
	pause();
	density_live = density;
	density_death = num_row * num_col - density;
	
	for(var i = 0; i < num_row*num_col; i++){
		if(wallArray[i] !== 1){
			if(density_live > 0 && density_death > 0){
				array[i] = Math.floor(Math.random() * 2);
			}else if(density_live > 0){
				array[i] = 1;
			}else if(density_death > 0){
				array[i] = 0;
			}
			if(array[i] === 1)
				density_live--;
			else if(array[i] === 0)
			density_death--;
		}
		else{
			array[i] = 2;
		}
		auxArray[i] = 0;
	}


	drawGrid();
	
}

function pause(){
	auto_flag = 0;
	clearInterval(auto);
}

function setSize(){
	var temp_num_col = $('#num_col').val();
	var temp_num_row = $('#num_row').val();
	if(temp_num_col === undefined || temp_num_col === ""){
		alert("numbers of col is empty, invalid input");
		return;
	}else if(temp_num_row === undefined || temp_num_row === ""){
		alert("numbers of row is empty, invalid input");
		return;
	}
	density = density * temp_num_col * temp_num_row / (Number(num_col) * Number(num_row))
	num_col = Number(temp_num_col);
	num_row = Number(temp_num_row);	
	gw = bw / num_col;
	gh = bh / num_row;
	initGrid();
}   

function getSize(){
	alert("the number of col is " + num_col + " and the number of row is " + num_row);
}

function setFps(){
	var temp_fps = $('#fps').val();
	if(temp_fps === undefined || temp_fps === ""){
		alert("fps is empty, invalid input");
		return;
	}
	fps = Number(temp_fps);
	alert("Now your fps is " + fps);
}

function getFps(){
	alert("the fps is " + fps);
}

function setDensity(){
	var temp_density = $('#density').val();
	if(temp_density === undefined || temp_density === ""){
		alert("density is empty, invalid input");
		return;
	}
	density = Number(temp_density);
	alert("the density is " + density + " and the number of grids in the map is " + num_row * num_col);
}

function getDensity(){
	alert("the density is " + density + " and the number of grids in the map is " + num_row * num_col);
}

window.onload = function() {
	// body...
	initGrid();
	
	$('button#update').click(update);
	$('button#play').click(play);
	$('button#restart').click(reinitGrid);
	$('button#pause').click(pause);
	
	$('button#set_size').click(setSize);
	$('button#get_size').click(getSize);
	$('button#set_fps').click(setFps);
	$('button#get_fps').click(getFps);
	$('button#set_density').click(setDensity);
	$('button#get_density').click(getDensity);
	
};