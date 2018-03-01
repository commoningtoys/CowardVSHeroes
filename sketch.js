/**
 * 
 * @returns the minimum between width and height of the contained div
 */
function minimum(){
	let cnvDiv = document.getElementById('myContainer');
	let w = cnvDiv.offsetWidth;
	let h = cnvDiv.offsetHeight;
	if(w < h) return w;
	else return h;
}
function resizeSketch(){
	let canvasWidth = minimum();
	resizeCanvas(canvasWidth, canvasWidth);
}
let cnv, flock;
function setup() {
	cnv = createCanvas(minimum(), minimum());
	cnv.parent('p5Sketch');
	flock = new Flock(30);
}

function draw() {
	background(0);
	flock.update();
	flock.show();
}