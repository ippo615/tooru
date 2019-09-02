'use strict';

$(function(){
	let PLAYER_COLORS = {};
	PLAYER_COLORS[PLAYERS.A] = '#F00';
	PLAYER_COLORS[PLAYERS.B] = '#00F';
	PLAYER_COLORS[PLAYERS.C] = '#0A0';
	PLAYER_COLORS[PLAYERS.D] = '#BB0';
	PLAYER_COLORS[PLAYERS.NONE] = '#888';

	let w = 10;
	let h = 10;

	// Create a new board with each piece pointing in a random direction
	let b = new Board(w,h);
	b.generate();
	function getRandomDirection(){
		let keys = Object.keys( DIRECTIONS );
		return DIRECTIONS[keys[Math.floor(Math.random()*keys.length)]];
	}
	for( let y=0, h=b.height; y<h; y+=1 ){
		for( let x=0, w=b.width; x<w; x+=1 ){
			b.getPieceAt(x,y).direction = getRandomDirection();
		}
	}
	
	// Set the 4 corners to a different color and connect them
	b.getPieceAt(0,0).player = PLAYERS.A;
	b.getPieceAt(w-1,h-1).player = PLAYERS.B;
	b.getPieceAt(0,h-1).player = PLAYERS.C;
	b.getPieceAt(w-1,0).player = PLAYERS.D;
	b.applyConnection(0,0);
	b.applyConnection(w-1,h-1);
	b.applyConnection(0,h-1);
	b.applyConnection(w-1,0);
	
	// Build the board as html
	let boarderRender = new BoardRenderHtml(b);
	$('#game').html( boarderRender.asHtmlString() );
	$('#style-holder').html( '<style>'+boarderRender.generateCss()+'</style>' );

	// Debugging to make sure saving/loading works
	let boardString = (new BoardRenderSimpleString(b)).asSimpleString();
	let boardFromString = (new BoardRenderSimpleString(b)).fromSimpleString(boardString);
	console.info( boardFromString );

	// Debugging to make sure chain analyzers work
	var b2 = new BoardAnalyzerChainLength(b);
	console.info( b2.data );

	// Initial animation to show the board being setup/created
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
	
	// When a piece is clicked:
	//  1. rotate it 90 degrees clockwise
	//  2. propogate its color to all the connected pieces
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
				b.activatePieceAt(x,y);
				let depthMap = b.applyConnection(x,y);
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
									let boarderRender = new BoardRenderHtml(b);
									$('#game').html( boarderRender.asHtmlString() );
									//$('#style-holder').html( '<style>'+boarderRender.generateCss()+'</style>' );
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
			}
		});
	});
});

