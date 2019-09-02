'use strict';

class Piece{
	constructor(){
		this.direction = DIRECTIONS.EAST;
		this.player = PLAYERS.NONE;
		this.visited = false;
	}
	asString(){
		return ''+this.direction;
	}
}

