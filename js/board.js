'use strict';

class Board{
	constructor( width, height ){
		this.grid;
		this.width = width;
		this.height = height;
		this.visitedList = [];
		this.generate();
	}
	generate(){
		// https://stackoverflow.com/questions/5501581/javascript-new-arrayn-and-array-prototype-map-weirdness
		let rows = (new Array(this.height)).fill(undefined).map( _ => new Array(this.width) );
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				rows[y][x] = new Piece();
			}
		}
		this.grid = rows;
	}
	getPieceAt( x, y ){
		return this.grid[y][x];
	}
	areConnected( x1, y1, x2, y2 ){
		let dx = x2 - x1;
		let dy = y2 - y1;
		const allowed_pairs = {
			'1,0': [ DIRECTIONS.EAST, DIRECTIONS.WEST ], // dx=1, dy=0, p1.d==0 or p2.d==180
			'0,1': [ DIRECTIONS.SOUTH, DIRECTIONS.NORTH ],
			'-1,0': [ DIRECTIONS.WEST, DIRECTIONS.EAST ],
			'0,-1': [ DIRECTIONS.NORTH, DIRECTIONS.SOUTH ]
		};
		let dxdy = dx+','+dy;
		let options = allowed_pairs[dxdy];
		let piece1 = this.getPieceAt(x1,y1);
		let piece2 = this.getPieceAt(x2,y2);
		if( options[0] == piece1.direction % 360 ){
			return true;
		}
		if( options[1] == piece2.direction % 360 ){
			return true;
		}
		return false;
	}
	getDepthMapFrom( x, y ){
		this._clearVisitedList();
		let dMap = [[]];
		let propogationArray = this._propogateFrom(x,y);
		let depthMap = this._propogationArraysToDepthMap( propogationArray, dMap, 0 );
		this._clearVisitedList();
		return depthMap;
	}
	depthMapSetPlayer( depthMap, player ){
		var that = this;
		Object.keys(depthMap).forEach(function (key) {
			let pieces = depthMap[key];
			for( let p of pieces ){
				that.getPieceAt(p.x,p.y).player = player;
			}
		});
	}
	applyConnection( x, y ){
		let depthMap = this.getDepthMapFrom( x, y );
		let player = this.getPieceAt( x, y ).player;
		this.depthMapSetPlayer( depthMap, player );
		return depthMap;
	}
	activatePieceAt( x, y ){
		let piece = this.grid[y][x];
		piece.direction += 90;
		return this._propogateFrom(x,y);
	}

	_propogateConnection(x,y,dx,dy){
		// let player = this.getPieceAt(x,y).player;
		if( x+dx < 0 ){ return []; }
		if( this.width <= x+dx ){ return []; }
		if( y+dy < 0 ){ return []; }
		if( this.height <= y+dy ){ return []; }
		if( this.areConnected(x,y,x+dx,y+dy) ){
			let connected_piece = this.getPieceAt(x+dx,y+dy);
			if( connected_piece.visited == false ){
				return this._propogateFrom(x+dx,y+dy);
			}
		}
		return [];
	}
	
	_propogateFrom(x,y){
		// Remember that we've been to this piece
		let piece = this.getPieceAt(x,y);
		piece.visited = true;
		this.visitedList.push( piece );
		
		// Always add this point to the results
		let results = [ new Point(x,y) ];
		
		// Check the surronding 4 pieces (N,S,E,W)
		// If there are any results then add them to current results
		let connection = [];
		connection = this._propogateConnection( x,y, 1, 0 );
		if( connection.length ){results.push(connection);}
		connection = this._propogateConnection( x,y,-1, 0 );
		if( connection.length ){results.push(connection);}
		connection = this._propogateConnection( x,y, 0, 1 );
		if( connection.length ){results.push(connection);}
		connection = this._propogateConnection( x,y, 0,-1 );
		if( connection.length ){results.push(connection);}
		
		return results;
	}
	
	_clearVisitedList(){
		for( let piece of this.visitedList ){
			piece.visited = false;
		}
		this.visitedList = [];
	}
	_propogationArraysToDepthMap( nestedArrays, depthMap, depth ){
		if( depthMap.length <= depth ){
			depthMap.push([]);
		}
		for( let value of nestedArrays ){
			if( value instanceof Point ){
				depthMap[depth].push( value );
			}else{
				this._propogationArraysToDepthMap( value, depthMap, depth+1 );
			}
		}
		return depthMap;
	}

}

