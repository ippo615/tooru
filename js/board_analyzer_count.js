'use strict';

class BoardAnalyzerCount extends BoardAnalyzer{
	constructor( board, passFilter, failFilterValue ){
		super( board );
		let rows = (new Array(this.height)).fill(undefined).map( _ => new Array(this.width) );
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				if( passFilter ){
					if( passFilter( board, x, y ) ){
						rows[y][x] = this.computeRotationAt(x,y);
					}else{
						rows[y][x] = failFilterValue;
					}
				}else{
					rows[y][x] = this.computeRotationAt(x,y);
				}
			}
		}
		this.data = rows;
	}
	computeRotationAt(x,y){
		let originalBoard = this.board;
		let b = this.copyBoard( this.board );
		this.board = b;
		this.board.activatePieceAt(x,y);
		this.board.applyConnection(x,y);
		let count = this.getPlayerCount( this.board.getPieceAt(x,y).player );
		this.board = originalBoard;
		return count;
	}
	asHtmlString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				let dom = '';
				if( this.board.getPieceAt(x,y).player == PLAYERS.NONE ){
					dom += '<div class="grid-space"></div>';
				}else{
					dom += '<div class="grid-space">'+this.data[y][x]+'</div>';
				}
				row[x] = dom;
			}
			rows[y] = row.join('');
		}
		return rows.join('\n');
	}
}

