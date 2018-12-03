/**
 * 
 * @returns
 */
function minimum(){
	let cnvDiv = document.getElementById('myContainer');
	let w = cnvDiv.offsetWidth;
	let h = cnvDiv.offsetHeight;
	console.log(cnvDiv.offsetHeight)
	console.log(w, h);
	return{
		width: w,
		height: h
	};
}
function windowResized(){
	resizeCanvas(innerWidth, innerHeight);
}


const BEHAVIOURS = ['cowards', 'heroes', 'triangle'];

let cnv;
let flock;
function setup() {
	// cnv = createCanvas(minimum().width, minimum().height);
	cnv = createCanvas(innerWidth, innerHeight);
	cnv.parent('p5Sketch');
	flock = new Flock(50, BEHAVIOURS[2]);
	updateMenu();
}

function draw() {
	background(51);
	// fill(0, 20);
	// rect(0, 0, width, height);
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

function setAgents(){
	// const cowards = document.getElementById('cowards');
	// const heroes = document.getElementById('heroes');
	// const triangle = document.getElementById('triangle');
	const arr = [];
	let sum = 0;
	for (const b of BEHAVIOURS) {
		const value = document.getElementById(b).value;
		for(let i = 0; i < value; i++){
			arr.push(b);
		}
	}
	console.log(arr);
	flock.setAgents(arr);
}

function updateMenu(){
	document.getElementById('speed').innerText = document.getElementById('inputSpeed').value;
	document.getElementById('cowards').innerText = flock.getAgentsNumber().cowards;
	document.getElementById('heroes').innerText = flock.getAgentsNumber().heroes;
	document.getElementById('triangle').innerText = flock.getAgentsNumber().triangle;
}