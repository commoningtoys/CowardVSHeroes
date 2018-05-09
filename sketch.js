/**
 * 
 * @returns the minimum between width and height of the contained div
 */
function minimum(){
	let cnvDiv = document.getElementById('myContainer');
	let w = cnvDiv.offsetWidth;
	let h = cnvDiv.offsetHeight;
	console.log(w, h);
	return{
		width: w,
		height: h
	};
}
function windowResized(){
	let canvasWidth = minimum();
	resizeCanvas(minimum().width, minimum().height);
}
let cnv, flock;
function setup() {
	cnv = createCanvas(minimum().width, minimum().height);
	cnv.parent('p5Sketch');
	flock = new Flock(300);
	updateMenu();
}

function draw() {
	// background(51);
	fill(51);
	rect(0, 0, width, height);
	flock.update();
	flock.show();
}

function speed(){
	let speed = document.getElementById('inputSpeed').value;
	speed = parseFloat(speed);
	console.log(speed);
	flock.setSpeed(speed);
	updateMenu();
}

function flockRandomSeed(){
	let seed = document.getElementById('inputRandomSeed').value;
	seed = parseFloat(seed);
	console.log(seed);
	flock.setRandomSeed(seed);
	updateMenu();
}

function updateMenu(){
	document.getElementById('speed').innerHTML = document.getElementById('inputSpeed').value;
	document.getElementById('cowards').innerHTML = flock.getAgentsNumber().cowards;
	document.getElementById('heroes').innerHTML = flock.getAgentsNumber().heroes;
}