// check for collisions and returns true or false,
function isCollision(obj1X, obj1Y, obj2X , obj2Y){
	var offset=20;
	if (obj1X < obj2X + tile.x - offset &&
		obj1X + tile.x > obj2X + offset&&
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

//resets game
function gameReset(){
	propGen(allGems, false);
	propGen(allEnemies, true);
}

//generates postions and speed for gem/enemy
function propGen(array,isSpeed){
	for (var i=0; i < array.length; i += 1){
		var posX = getRandomInt(0, tile.xNum-1)* tile.x;
		var posY = getRandomInt(1,3)*tile.y-tile.cut;

		//makes sure that no two postions are the same
		function checkSame(){
			for(var num=i; num > 0; num -= 1){
				var count =num-1;

				if (posX == array[count].x && posY == array[count].y){
					posX = getRandomInt(0, tile.xNum-1)* tile.x;
					posY = getRandomInt(1,3)*tile.y-tile.cut;
					checkSame();
				}
			}
		}

		checkSame();
		array[i].x=posX;
		array[i].y=posY;
		if (isSpeed==true){
			array[i].speed= getRandomInt(20,50);
		}
	}
	array= sortDraw(array);
}

// sorts the tiles so tiles a re drawn back to front
function sortDraw(arr){
	arr.sort(sortFunc);
	function sortFunc(a,b){
		if (a.y === b.y) return 0;
		else return(a.y < b.y) ? -1:1;
	};
	return arr;
}


var winGame = false;
var loseGame = false;

var level = function(nEmemis,nGems){
	this.numEnemies = nEmemis;
	this.numGems = nGems;
};

// values for gems and enemis in levels
var allLevels = [
	new level(2,1),
	new level(3,5),
	new level(1,3),
	new level(1,4)
];

var numLv= -1;
var numEnemies;
var numGems;

var allGems =[];
var allEnemies=[];
var gemCounter = 0;

//changes level, if all levels complete, send win state
function changeLevel(){
	numLv+=1;
	console.log(numLv);
	if (numLv== allLevels.length){
		console.log("win");
		winGame = true;
		return;
	}

	numEnemies= allLevels[numLv].numEnemies;
	numGems = allLevels[numLv].numGems;
	console.log(allLevels[numLv].numEnemies , allLevels[numLv].numGems);

	// push/pop array to match the number items need in level
	function matchArrayNum(array, num, newObj){
		while (array.length< num){
			array.push(new newObj());
		}
		while(array.length>num){
			array.pop();
		}
	}

	// cannot call array on first run since arrays havent been filled
	if (numLv > 0){
		matchArrayNum(allGems, allLevels[numLv].numGems, Gem);
		matchArrayNum(allEnemies, allLevels[numLv].numEnemies, Enemy);
		gameReset();
	}
}

changeLevel();




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
};



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
		loseGame = true;
	}
};


Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Player
var Player = function(x, y) {
	this.sprite ='images/char-boy.png';
	this.x= x;
	this.y= y;
};


//Player
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


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
		changeLevel();
	}
	if(this.y>=tile.yStart){
		this.y = tile.yStart;
	}
};


// instantiate enemies
for (var i=0; i < numEnemies; i += 1){
	allEnemies[i]= new Enemy(1,1,1);
}
propGen(allEnemies, true);


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



/////////////GEM

////////////
var Gem = function(x,y){
	var sprite = [
		'images/Gem Blue.png',
		'images/Gem Orange.png',
		'images/Gem Green.png'
		]
	this.sprite = sprite[getRandomInt(0,2)]
	this.x =x;
	this.y =y;
};

Gem.prototype.render= function(){
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// instantiate gem
for (var i=0; i < numGems; i += 1){
	allGems[i]= new Gem(1,1,1);
};

propGen(allGems,false);

Gem.prototype.update = function(){
	if(isCollision(this.x, this.y, player.x, player.y)){
		this.x =-100;
		this.y =-100;
		gemCounter +=1;
	}
};


