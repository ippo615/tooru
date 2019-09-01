// ←↑→↓
'use strict';

const DIRECTIONS = Object.freeze({
	NORTH: 270,
	SOUTH: 90,
	EAST: 0,
	WEST: 180,
	NONE: 0
});
const CCW_SEQUENCE = Object.freeze([ DIRECTIONS.NORTH, DIRECTIONS.WEST, DIRECTIONS.SOUTH, DIRECTIONS.EAST ]);
const CW_SEQUENCE = Object.freeze([ DIRECTIONS.NORTH, DIRECTIONS.EAST, DIRECTIONS.SOUTH, DIRECTIONS.WEST ]);

const PLAYERS = Object.freeze({
	A: 'player1',
	B: 'player2',
	C: 'player3',
	D: 'player4',
	NONE: 'none'
});

function getRandomDirection(){
	let keys = Object.keys( DIRECTIONS );
	return DIRECTIONS[keys[Math.floor(Math.random()*keys.length)]];
}

class Point{
	constructor( x, y ){
		this.x = x;
		this.y = y;
	}
}

class Piece{
	constructor(){
		//this.direction = DIRECTIONS.NONE;
		this.direction = getRandomDirection();
		this.player = PLAYERS.NONE;
	}
	asString(){
		return ''+this.direction;
	}
}

class Board{
	constructor( width, height ){
		this.grid;
		this.width = width;
		this.height = height;
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
	areConnected( x1, y1, x2, y2 ){
		let dx = x2 - x1;
		let dy = y2 - y1;
		const allowed_pairs = {
			'1,0': [0,180], // dx=1, dy=0, p1.d==0 or p2.d==180
			'0,1': [90,270],
			'-1,0': [180,0],
			'0,-1': [270,90]
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
	propogateConnection(x,y,dx,dy){
		let player = this.getPieceAt(x,y).player;
		if( x+dx < 0 ){ return []; }
		if( this.width <= x+dx ){ return []; }
		if( y+dy < 0 ){ return []; }
		if( this.height <= y+dy ){ return []; }
		if( this.areConnected(x,y,x+dx,y+dy) ){
			let connected_piece = this.getPieceAt(x+dx,y+dy);
			if( connected_piece.player != player ){
				connected_piece.player = player;
				return this.propogateFrom(x+dx,y+dy);
			}
		}
		return [];
	}
	propogateFrom(x,y){
		let results = [ new Point(x,y) ];
		let connection = this.propogateConnection( x,y, 1, 0 );
		if( connection.length ){results.push(connection);}
		connection = this.propogateConnection( x,y,-1, 0 );
		if( connection.length ){results.push(connection);}
		connection = this.propogateConnection( x,y, 0, 1 );
		if( connection.length ){results.push(connection);}
		connection = this.propogateConnection( x,y, 0,-1 );
		if( connection.length ){results.push(connection);}
		return results;
	}
	propogationArraysToDelayMap( nestedArrays, depthMap, depth ){
		if( depthMap.length <= depth ){
			depthMap.push([]);
		}
		for( let value of nestedArrays ){
			if( value instanceof Point ){
				depthMap[depth].push( value );
			}else{
				this.propogationArraysToDelayMap( value, depthMap, depth+1 );
			}
		}
		return depthMap;
	}
	getPieceAt( x, y ){
		return this.grid[y][x];
	}
	activatePieceAt( x, y ){
		let piece = this.grid[y][x];
		piece.direction += 90;
		return this.propogateFrom(x,y);
	}
	asString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				// This can be modified to make other visualizations
				row[x] = this.grid[y][x].asString();
			}
			rows[y] = row.join('');
		}
		return rows.join('\n');
	}
	asHtmlString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				// This can be modified to make other visualizations
				let player = this.grid[y][x].player;
				let direction = this.grid[y][x].direction;
				let dom = '';
				dom += '<div id="grid-space-'+x+'-'+y+'" class="grid-space '+player+'" data-xy="'+x+','+y+'">';
				dom += '<div id="piece-'+x+'-'+y+'" class="piece '+player+'">';
				dom += '</div></div>';
				row[x] = dom;
			}
			rows[y] = row.join('');
		}
		return rows.join('\n');
	}
}

$(function(){
	let PLAYER_COLORS = {};
	PLAYER_COLORS[PLAYERS.A] = '#F00';
	PLAYER_COLORS[PLAYERS.B] = '#00F';
	PLAYER_COLORS[PLAYERS.C] = '#0A0';
	PLAYER_COLORS[PLAYERS.D] = '#BB0';
	PLAYER_COLORS[PLAYERS.NONE] = '#888';

	let w = 20;
	let h = 20;

	let b = new Board(w,h);
	b.generate();
	b.getPieceAt(0,0).player = PLAYERS.A;
	b.getPieceAt(w-1,h-1).player = PLAYERS.B;
	b.getPieceAt(0,h-1).player = PLAYERS.C;
	b.getPieceAt(w-1,0).player = PLAYERS.D;
	b.propogateFrom(0,0);
	b.propogateFrom(w-1,h-1);
	b.propogateFrom(0,h-1);
	b.propogateFrom(w-1,0);
	$('#game').html( b.asHtmlString() );

	function copyBoard(b){
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
	
	for( let y=0, h=b.height; y<h; y+=1 ){
		for( let x=0, w=b.width; x<w; x+=1 ){
			let piece = b.getPieceAt(x,y);
			anime({
				targets: '#piece-'+x+'-'+y,
				rotate: piece.direction,
				background: PLAYER_COLORS[piece.player],
				duration: 1200,
				delay: x*500+Math.random()*500
			});
			anime.set( '#grid-space-'+x+'-'+y, {
				background: PLAYER_COLORS[piece.player],
			});
		}
	}
	
	// Listen to this next time:
	// https://www.youtube.com/watch?v=BVeI1FPh6i8
	
	$('.board').on('click','.grid-space',function(e){
		let target = $(e.target).closest('.grid-space');
		let piece = target.find('.piece')[0];
		let grid_xy = target.data('xy').split(',');
		let x = parseInt(grid_xy[0]);
		let y = parseInt(grid_xy[1]);

		// begin rotation animation
		anime({
			targets: piece,
			rotate: b.getPieceAt(x,y).direction+90,
			// when the rotation animation finishes, update the board state
			complete: function(){
				// New
				let b2 = copyBoard( b );
				let propogationArray = b.activatePieceAt( x, y );
				let depthMap = [[]];
				console.info( b.propogationArraysToDelayMap( propogationArray, depthMap, 0 ) );
				// 
				for( let depth = 0, maxDepth = depthMap.length; depth < maxDepth; depth += 1 ){
					let points = depthMap[depth];
					for( let point of points ){
						anime({
							targets: ['#piece-'+point.x+'-'+point.y, '#grid-space-'+point.x+'-'+point.y],
							background: PLAYER_COLORS[b.getPieceAt( point.x, point.y ).player],
							delay: 75*depth,
							complete: function(){
								if( anime.running.length == 0 ){
									// after all the other stuff is done:
									// update board state (rotations)
									$('#game').html( b.asHtmlString() );
									for( let y=0, h=b.height; y<h; y+=1 ){
										for( let x=0, w=b.width; x<w; x+=1 ){
											let p = b.getPieceAt(x,y);
											anime.set('#piece-'+x+'-'+y, {
												rotate: p.direction,
												background: PLAYER_COLORS[p.player]
											});
											anime.set( '#grid-space-'+x+'-'+y, {
												background: PLAYER_COLORS[p.player]
											});
										}
									}
								}
							}
						});
					}
				}
				// Old
				/*
				b.activatePieceAt( x, y );
				$('#game').html( b.asHtmlString() );
				for( let y=0, h=b.height; y<h; y+=1 ){
					for( let x=0, w=b.width; x<w; x+=1 ){
						anime.set('#piece-'+x+'-'+y, {
							rotate: b.getPieceAt(x,y).direction
						});
					}
				}
				*/
			}
		});
	});
});

