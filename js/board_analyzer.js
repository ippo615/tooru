'use strict';

class BoardAnalyzer {
	constructor( board ){
		this.board = this.copyBoard(board);
		this.width = this.board.width;
		this.height = this.board.height;
	}
	getPlayerCount( player ){
		let count = 0;
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				if( this.board.getPieceAt(x,y).player == player ){
					count += 1;
				}
			}
		}
		return count;
	}
	copyBoard(b){
		let b2 = new Board(b.width,b.height);
		b2.generate();
		for( let y=0, h=b.height; y<h; y+=1 ){
			for( let x=0, w=b.width; x<w; x+=1 ){
				b2.grid[y][x] = new Piece( );
				b2.grid[y][x].player = b.grid[y][x].player;
				b2.grid[y][x].direction = b.grid[y][x].direction;
			}
		}
		return b2;
	}
}

