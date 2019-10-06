'use strict';

class BoardRenderCanvas {
	constructor( board, allyPlayers, enemyPlayers, neutralPlayers ){
		
		this.board = board;
		
		this.allyPlayers = allyPlayers;
		this.enemyPlayers = enemyPlayers;
		this.neutralPlayers = neutralPlayers;
		
		this.directions = {};
		this.directions[ DIRECTIONS.NORTH ] = 128;
		this.directions[ DIRECTIONS.EAST ] = 160;
		this.directions[ DIRECTIONS.SOUTH ] = 192;
		this.directions[ DIRECTIONS.WEST ] = 224;

	}
	
	asCanvas(){
		let canvas = document.createElement('canvas');
		canvas.width = this.board.width;
		canvas.height = this.board.height;
		let context = canvas.getContext('2d');
		let b = this.board;
		for( let y=0, h=b.height; y<h; y+=1 ){
			for( let x=0, w=b.width; x<w; x+=1 ){
				let piece = b.getPieceAt(x,y);
				let player = piece.player;
				let direction = piece.direction;
				let imageData = context.createImageData( 1, 1 );
				imageData.data[0] = 0;
				imageData.data[1] = 0;
				imageData.data[2] = 0;
				imageData.data[3] = 255;
				if( this.allyPlayers.indexOf(player) >= 0 ){
					imageData.data[2] = this.directions[direction];
				}else
				if( this.enemyPlayers.indexOf(player) >= 0 ){
					imageData.data[0] = this.directions[direction];
				}else
				if( this.neutralPlayers.indexOf(player) >= 0 ){
					imageData.data[1] = this.directions[direction];
				}else{
					console.info( 'wtf?' );
				}
				context.putImageData(imageData,x,y);
			}
		}
		return canvas;
	}
}

