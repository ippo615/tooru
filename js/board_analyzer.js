'use strict';

class BoardAnalyzer {
	constructor( board ){
		this.board = this.copyBoard(board);
		this.width = this.board.width;
		this.height = this.board.height;
	}
	getMaxValue( ){
		// TODO: this.data is generally set by a subclass, maybe we should fill it with 0's in the constructor?
		let valueMax = this.data[0][0];
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				if( this.data[y][x] > valueMax ){
					valueMax = this.data[y][x];
				}
			}
		}
		return valueMax;
	}
	getLocationsWithValue( value ){
		let results = [];
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				if( this.data[y][x] == value ){
					results.push([x,y]);
				}
			}
		}
		return results;
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

// Other analyzers to be built:
// - how many neighbors (N,S,E,W) pieces are the same player?
// - how many piece can capture this one? -- i think this a re-framing of the next one
// - if this piece is activated - how long of a chain will it create? (newly? or should that be a separate processing step)
