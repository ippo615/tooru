'use strict';

class BoardRenderSimpleString extends BoardAnalyzer {
	constructor( board ){
		super( board );
		
		this.players = {};
		this.players[PLAYERS.NONE] = 0b00000;
		this.players[PLAYERS.A]    = 0b00100;
		this.players[PLAYERS.B]    = 0b01000;
		this.players[PLAYERS.C]    = 0b01100;
		this.players[PLAYERS.D]    = 0b10000;
		
		this.directions = {};
		this.directions[DIRECTIONS.NORTH] = 0b00000;
		this.directions[DIRECTIONS.SOUTH] = 0b00001;
		this.directions[DIRECTIONS.EAST]  = 0b00010;
		this.directions[DIRECTIONS.WEST]  = 0b00011;

		this.characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	}
	
	asSimpleString(){
		// First convert all directions to 0,1,2,3 (0,90,180,270)
		// Then convert all players to 0,1,2,3,4 (None,PlayerA,PlayerB,PlayerC,PlayerD)
		// Each piece can then be encoded as 3 bits player + 2 bits direction
		// for a 10x10 board that's 500 bits = ~64 bytes
		
		// To make it simpler let's just build everything as 8 bits
		// and limit it to specific characters
		// 5 bits = 2**5 == 32 (ALPHABET+6)
		// 6 bits = 2**6 == 64 (UPPER+lower+8)
		
		// We dont want to waste data on width and height
		// so instead we put a ',' at the end of the first row
		// Then we can calculate width and height
		let result = '';
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				let piece = this.board.getPieceAt(x,y);
				let value = 0;
				value += this.directions[ piece.direction % 360 ];
				value += this.players[ piece.player ];
				result += this.characters[ value ];
			}
		}
		result = result.slice(0, this.width) + "," + result.slice(this.width);
		
		return result;
	}
	
	_getPlayer( characterIndex ){
		let player = 'none';
		let that = this;
		Object.keys(this.players).forEach(function (key) {
			let p = that.players[key];
			if( (p & characterIndex) == p ){
				player = key;
			}
		});
		return player;
	}
	_getDirection( characterIndex ){
		let direction = 0;
		let that = this;
		Object.keys(this.directions).forEach(function (key) {
			let d = that.directions[key];
			if( (d & characterIndex) == d ){
				direction = parseInt(key,10);
			}
		});
		return direction;
	}
	fromSimpleString( data ){
		let pieceCount = data.length-1;
		let width = data.indexOf(',');
		let height = pieceCount / width;
		let simpleString = data.replace(',','');
		let board = new Board( width, height );
		board.generate();
		for( let y=0; y<height; y+=1 ){
			for( let x=0; x<height; x+=1 ){
				let piece = board.getPieceAt(x,y);
				let c = simpleString[y*width+x];
				let characterIndex = this.characters.indexOf( c );
				piece.player = this._getPlayer( characterIndex );
				piece.direction = this._getDirection( characterIndex );
			}
		}

		return board;
	}
}

