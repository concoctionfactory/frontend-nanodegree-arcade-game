// check for collisions and returns true or false, 
function isCollision(obj1X, obj1Y, obj2X , obj2Y){
	if (obj1X < obj2X + tile.x &&
		obj1X + tile.x > obj2X &&
		obj1Y == obj2Y){
		return true;
	}

	else
		return false;
}


// Returns a random integer between min and max
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//pixel size for tiles, num of tiles and caluation for start and end of tiles
var tile={
	xNum: 5,
	yNum :6,
	y : 83,
	x : 101,
	cut : 25,
};

tile.yStart = tile.y * (tile.yNum-1)- tile.cut;
tile.yEnd = tile.cut;
tile.xEnd = tile.x *tile.xNum;
tile.xZero = 0;


//Enemy
var Enemy = function(x, y, speed) {
	this.sprite = 'images/enemy-bug.png';
	this.x= x;
	this.y= y;
	this.speed =speed;
}


Enemy.prototype.update = function(dt) {
//update enemies postion when reaching the end
	if (this.x >=tile.xEnd){
		this.x =-tile.x;
		this.y = getRandomInt(1,3)*tile.y-tile.cut;
	}
	else
		this.x += this.speed*dt;

//checks for collison with player and resets player
	if (isCollision(this.x, this.y, player.x, player.y)){
		console.log('hit');
		player.x = 2*tile.x;
		player.y = tile.yStart;
	}
}


Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//Player
var Player = function(x, y) {
	this.sprite ='images/char-boy.png';
	this.x= x;
	this.y= y;
}


//Player
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.handleInput= function(key){
	switch(key){
		case 'left':
			this.x-=tile.x;
		break;

		case 'up':
			this.y-=tile.y;
		break;

		case 'right':
			this.x+=tile.x;
		break;

		case 'down':
			this.y+=tile.y;
		break;
	}
}

//updates player postion
Player.prototype.update= function(){
	if (this.x >= tile.xEnd - tile.x){
		this.x = tile.xEnd - tile.x;
	}
	if (this.x <= tile.xZero){
		this.x =tile.xZero;
	}
	if(this.y <= tile.yEnd){
		this.y = tile.yStart;
	}
	if(this.y>=tile.yStart){
		this.y = tile.yStart;
	}
}


// instantiate enemies
var allEnemies  =[];
var numEnemies= 4;

var i;
for (i=0; i < numEnemies; i += 1){
	var ememyX = getRandomInt(0, tile.xNum)* tile.x;
	var ememyY = getRandomInt(1,3)*tile.y-tile.cut;
	allEnemies[i]= new Enemy(ememyX, ememyY, getRandomInt(20,50));
}


//instantiate player
var player = new Player(2*tile.x, tile.yStart,10);



// This listens for key presses and sends the keys to player
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
