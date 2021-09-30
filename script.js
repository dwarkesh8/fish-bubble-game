//canvas setup
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let canvasPosition = canvas.getBoundingClientRect();
	const mouse = {
		x: canvas.width/2,
		y: canvas.height/2,
		click: false
	}
});

let score = 0;
let gameFrame = 0;
ctx.font = '50px Times New Roman';

//Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
	x: canvas.width/2,
	y: canvas.height/2,
	click: false
}
canvas.addEventListener('mousedown',function(e){
	mouse.click = true;
	mouse.x = e.x - canvasPosition.left;
	mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseup',function(e){
	mouse.click = false;
});

//Player
const playerLeft = new Image();
playerLeft.src = 'images/fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'images/fish_swim_right.png';
class Player {
	constructor() {
		this.x = canvas.width;
		this.y = canvas.height;
		this.radius = 50;
		this.angle = 0;
		this.frameX = 0;
		this.frameY = 0;
		this.spriteWidth = 498;
		this.spriteHeight = 327;
	}
	update() {
		const dx = this.x - mouse.x;
		const dy = this.y - mouse.y;
		let theta = Math.atan2(dy, dx);
		this.angle = theta;
		if (mouse.x != this.x) {
			this.x -= dx/10;
		}
		if (mouse.y != this.y) {
			this.y -= dy/10;
		}
		if (gameFrame % 5 == 0) {
			this.frameX++;
		}
		if (this.frameX >= 3) {
			this.frameX = 0;
		}
	}
	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		if (this.x >= mouse.x) {
			ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - (this.radius+10), 0 - (this.radius-5), this.spriteWidth/4, this.spriteHeight/4);
		}
		else {
			ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - (this.radius+10), 0 - (this.radius-5), this.spriteWidth/4, this.spriteHeight/4);
		}
		ctx.restore();
	}
}
const player = new Player();

//bubble
let bubblesArray = [];

const bubbleImg = new Image();
bubbleImg.src = 'images/bubble-spritesheet.png';

class Bubble {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = canvas.height;
		this.frameX = 0;
		this.frameY = 0;
		this.spriteWidth = 512;
		this.spriteHeight = 512;
		this.speed = Math.random() * 5 + 1;
		this.radius = 50;
		this.distance;
		this.counted = false;
		this.blasting = false;
		this.blasted = false;
		this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
	}
	update() {
		if (!this.blasted) {
			if (this.blasting) {
				if (this.frameX <= 2 && this.frameY == 0) {
					this.frameX++;
				}
				else {
					this.frameY = 1;
					this.frameX = 0;
				}
			}
			if (this.frameY == 1) {
				this.blasted = true;
			}
			else {
				this.blasted = false;
			}
		}
		this.y -= this.speed;
		const dx = this.x - player.x;
		const dy = this.y - player.y;
		this.distance = Math.sqrt(dx*dx + dy*dy);
	}
	draw() {
		ctx.drawImage(bubbleImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - (this.radius+10), this.y - (this.radius+10), this.spriteWidth/4, this.spriteHeight/4);
	}
}
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'sounds/Plop.ogg';

const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'sounds/bubbles-single2.wav';

function handleBubbles() {
	if (gameFrame % 50 == 0) {
		bubblesArray.push(new Bubble());
	}
	for(let i = 0; i < bubblesArray.length; i++) {
		bubblesArray[i].update();
		bubblesArray[i].draw();
	}
	for(let i = 0; i < bubblesArray.length; i++) {
		if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
			bubblesArray.splice(i, 1);
		}
		if (bubblesArray[i]) {
			if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
				if (!bubblesArray[i].counted) {
					bubblesArray[i].blasting = true;
					bubblesArray[i].counted = true;
					if (bubblesArray[i].sound == 'sound1') {
						bubblePop1.play();
					}
					else {
						bubblePop2.play();
					}
				}
			}
		}
	}
	for(let i = 0; i < bubblesArray.length; i++) {
		if (bubblesArray[i].blasted) {
			bubblesArray.splice(i, 1);
			score++;
		}
	}
}

//Animation look
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.fillStyle = 'blue';
	ctx.lineWidth = 2;
	ctx.font = '45px Sans-serif'
	ctx.fillText('Score:'+ score, 0, 50);
	ctx.strokeStyle = 'yellow';
	ctx.strokeWidth = 2;
	ctx.strokeText('Score:'+ score, 0, 50);
	ctx.fillStyle = 'yellow';
	ctx.font = '25px Sans-serif'
	ctx.textAlign = "center";
	ctx.fillText('A Game by', canvas.width/2, canvas.height/2);
	ctx.font = '50px Sans-serif'
	ctx.fillStyle = 'skyblue';
	ctx.fillText('Charotar IT Solutions', canvas.width/2, canvas.height/2+50);
	ctx.stroke();
	ctx.restore();
	handleBubbles();
	player.update();
	player.draw();
	gameFrame++;
	requestAnimationFrame(animate);
}
animate();