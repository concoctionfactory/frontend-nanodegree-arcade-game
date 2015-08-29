// Returns a random integer between min and max
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



/*
	Game
*/

var game={
	winGame : false,
	loseGame : false,
};



/*
	*Tile
	*pixel size for tiles, num of tiles and caluation for start and end of tiles
*/

var tile={
	xNum: 5,
	yNum :6,
	y : 83,
	x : 101,
	cut : 25,
	offset: 20,
};

tile.yStart = tile.y * (tile.yNum-1)- tile.cut;
tile.yEnd = tile.cut;
tile.xEnd = tile.x *tile.xNum;
tile.xZero = 0;



/*
	Obj
*/



var Obj = function(x,y,speed,sprite){
	this.x =x;
	this.y =y;
	this.speed  = speed;
	this.sprite =sprite;
};

Obj.prototype.gen =function(){
	this.x = getRandomInt(0, tile.xNum-1)* tile.x;
	this.y = getRandomInt(1,3)*tile.y-tile.cut;
	if (this.speed!==0){
		this.speed= getRandomInt(20,50);
	}
};

Obj.prototype.render=function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Obj.prototype.isCollision =function (){
	if (this.x < player.x+ tile.x - tile.offset &&
		this.x + tile.x > player.x +  tile.offset&&
		this.y == player.y){
		return true;
	}

	else{
		return false;
	}
};



/*
	Emeny
*/



var Enemy = function() {
	Obj.call(this, 1, 1, 20, 'images/enemy-bug.png' );
};

Enemy.prototype = Object.create(Obj.prototype);
Enemy.prototype.constructor= Enemy;

Enemy.prototype.update = function(dt) {
//update enemies postion when reaching the end
	if (this.x >=tile.xEnd){
		this.x =-tile.x;
		this.y = getRandomInt(1,3)*tile.y-tile.cut;
	}
	else
		this.x += this.speed*dt;

//checks for collison with player and resets player
	if (this.isCollision()){
		console.log('lose');
		player.x = 2*tile.x;
		player.y = tile.yStart;
		game.loseGame = true;
	}
};



/*
	Player
*/



var Player = function(x, y) {
	Obj.call(this, x, y, 0, 'images/char-boy.png');
};

Player.prototype = Object.create(Obj.prototype);
Player.prototype.constructor = Player;

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
};

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
		this.x = 2*tile.x;
		allLvs.changeLevel();
	}
	if(this.y>=tile.yStart){
		this.y = tile.yStart;
	}
};


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



/*
	GEM
*/



var Gem = function(){
	var sprite = [
	'images/Gem Blue.png',
	'images/Gem Orange.png',
	'images/Gem Green.png'
	];
	Obj.call(this, 1, 1, 0, sprite[getRandomInt(0,2)]);
};

Gem.prototype = Object.create(Obj.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function(){
	if(this.isCollision()){
		this.x =-100;
		this.y =-100;
		allGems.counter +=1;
	}
};



/*
	Level
*/



var Level = function(nEnemies,nGems){
	this.numEnemies = nEnemies;
	this.numGems = nGems;
};

// values for gems and enemis in levels
var allLvs = [
	new Level(1,6),
	new Level(3,5),
	new Level(1,3),
	new Level(1,4)
];
// current level
allLvs.curr = -1;


//changes level, if all levels complete, send win state
allLvs.changeLevel =function (){
	this.curr +=1;
	//console.log("lv",this.curr+1);

	if (this.curr== this.length){
		console.log("win");
		game.winGame = true;
		return;
	}

	console.log("enemy",this[this.curr].numEnemies , "gem",this[this.curr].numGems);

	// instantiate enemies, instantiate gem
	allEnemies.num= this[this.curr].numEnemies;
	allGems.num =this[this.curr].numGems;
	allEnemies.propGen();
	allGems.propGen();
};



/*
	Enemy & Gem Array
*/



var allGems =[];
allGems.obj= Gem;
allGems.num =0;
allGems.counter =0;

var allEnemies=[];
allEnemies.obj= Enemy;
allEnemies.num=0;



	//generates postions and speed for gem/enemy
allGems.propGen =function(){

	// push/pop array to match the number items need in level
	function matchArrayNum(array){
		while (array.length< array.num){
			array.push(new array.obj());
		}
		while(array.length>array.num){
			array.pop();
		}
	}

	//makes sure that no two postions are the same
	function checkSame(array, num){
		//console.log("check",num);
		for(var curr=num; curr > 0; curr -= 1){
			var prev =curr-1;
			if (array[num].x == array[prev].x && array[num].y == array[prev].y){
				//console.log("match");
				array[num].gen();
				//console.log(array);
				checkSame(array,num);
			}
		}
	}

	// sorts the tiles so tiles are drawn back to front
	function sortDraw(array){
		array.sort(sortFunc);
		function sortFunc(a,b){
			if (a.y === b.y) return 0;
			else return(a.y < b.y) ? -1:1;
		}
	}


	matchArrayNum(this);
	for (var i=0; i < this.length; i += 1){
		this[i].gen();
		//console.log(i,this[i]);
		checkSame(this,i);
	}
	sortDraw(this);

};


allEnemies.propGen = function(){
	allGems.propGen.call(this, true);
};





allLvs.changeLevel();

//instantiate player
var player = new Player(2*tile.x, tile.yStart,10);
