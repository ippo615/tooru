'use strict';

class BoardAnalyzerTurnsToCapture extends BoardAnalyzer{
	constructor( board ){
		super( board );
		
		// The following should be class properties
		this.directions_to_dx_dy = {};
		this.directions_to_dx_dy[DIRECTIONS.NORTH] = {dx: 0,dy:-1};
		this.directions_to_dx_dy[DIRECTIONS.SOUTH] = {dx: 0,dy: 1};
		this.directions_to_dx_dy[DIRECTIONS.EAST ] = {dx: 1,dy: 0};
		this.directions_to_dx_dy[DIRECTIONS.WEST ] = {dx:-1,dy: 0};
		this.MAX_TURNS_TO_CAPTURE_TURNS = 40;
		
		// This is regular stuff
		let rows = (new Array(this.height)).fill(undefined).map( _ => new Array(this.width) );
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				rows[y][x] = this.computeTurnsToCapture(x,y);
			}
		}
		this.data = rows;
	}
	computeTurnsToCapture(x,y){
		let piece = this.board.getPieceAt(x,y);
		let player = piece.player;
		let direction = piece.direction;
		for( let nTurns=1; nTurns < 5; nTurns += 1 ){
			let d = (direction + 90*nTurns) % 360;
			let checkDelta = this.directions_to_dx_dy[d];
			let xOther = x+checkDelta.dx;
			let yOther = y+checkDelta.dy;
			if( xOther < 0 ){ continue; }
			if( yOther < 0 ){ continue; }
			if( xOther >= this.width ){ continue; }
			if( yOther >= this.height ){ continue; }
			let otherPiece = this.board.getPieceAt(xOther,yOther);
			if( otherPiece.player != player ){
				return nTurns;
			}
		}
		// return 40 turns -- that should be a big enought number to distinguish
		return this.MAX_TURNS_TO_CAPTURE_TURNS;
	}
	asHtmlString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				let dom = '';
				if( this.data[y][x] == this.MAX_TURNS_TO_CAPTURE_TURNS || this.board.getPieceAt(x,y).player == PLAYERS.NONE ){
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

