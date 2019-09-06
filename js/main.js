'use strict';

$(function(){
	// Some fun gameplay ideas:
	//  Players rotate pieces until they can no longer capture but
	//  they can only rotate the piece at the end of their last chain
	// Some interesting effects:
	//  a) making the player color the same as the background (looks like a maze)
	//  b) making the non-used colors the same as the background (everything is a guess)
	let PLAYER_COLORS = {};
	PLAYER_COLORS[PLAYERS.A] = '#F00';
	PLAYER_COLORS[PLAYERS.B] = '#00F';
	PLAYER_COLORS[PLAYERS.C] = '#BB0';
	PLAYER_COLORS[PLAYERS.D] = '#0A0';
	PLAYER_COLORS[PLAYERS.NONE] = '#888';
	// For "cleaner" or simpler style use the same dark and light colors
	// let PLAYER_CONNECTOR_COLORS = PLAYER_COLORS;
	
	let PLAYER_CONNECTOR_COLORS = {};
	PLAYER_CONNECTOR_COLORS[PLAYERS.A] = '#800';
	PLAYER_CONNECTOR_COLORS[PLAYERS.B] = '#008';
	PLAYER_CONNECTOR_COLORS[PLAYERS.C] = '#550';
	PLAYER_CONNECTOR_COLORS[PLAYERS.D] = '#060';
	PLAYER_CONNECTOR_COLORS[PLAYERS.NONE] = '#888';
	

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
				background: PLAYER_CONNECTOR_COLORS[piece.player],
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
	$('#game').on('click','.grid-space',function(e){
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
				b.activatePieceAt(x,y);
				let depthMap = b.applyConnection(x,y);
				for( let depth = 0, maxDepth = depthMap.length; depth < maxDepth; depth += 1 ){
					let points = depthMap[depth];
					for( let point of points ){
						anime({
							targets: ['#grid-space-'+point.x+'-'+point.y],
							background: PLAYER_COLORS[b.getPieceAt( point.x, point.y ).player],
							delay: 75*depth,
						});
						anime({
							targets: ['#piece-'+point.x+'-'+point.y],
							background: PLAYER_CONNECTOR_COLORS[b.getPieceAt( point.x, point.y ).player],
							delay: 75*depth,
							complete: function(){
								// anime.running.length will never be 0. After the animation
								// is `.complete()ed` then `running.length` is decreased.
								// It also happens that multiple animations can finish at the
								// same time. So the laste animations to finish are the ones at
								// the end of the chain (which are the deepest in the depthMap). 
								// This means that we should check if the number of running
								// animations is equal to the length of the last group of the
								// depthMap.
								// Never mind. That doesnt work. I'll need to add a delay and
								// debouncer on it. 10ms? after complete -> check if 0
							}
						});
					}
				}
				anime({
					targets: {
						just_so_i_know_when_stuff_ends: '0%'
					},
					just_so_i_know_when_stuff_ends: '100%',
					delay: 75*(depthMap.length+1),
					complete: function(){
						console.info('x');
						console.info(anime.running.length);
						if( anime.running.length <= 1 ){
							console.info('b');
							// after all the other stuff is done:
							// update board state (rotations)
							let boarderRender = new BoardRenderHtml(b);
							$('#game').html( boarderRender.asHtmlString() );
							$('#style-holder').html( '<style>'+boarderRender.generateCss()+'</style>' );
							for( let y=0, h=b.height; y<h; y+=1 ){
								for( let x=0, w=b.width; x<w; x+=1 ){
									let p = b.getPieceAt(x,y);
									anime.set( '#piece-'+x+'-'+y, {
										rotate: p.direction,
										background: PLAYER_CONNECTOR_COLORS[p.player]
									});
									anime.set( '#grid-space-'+x+'-'+y, {
										background: PLAYER_COLORS[p.player]
									});
								}
							}

							// Add an overlay showing chain lengths
							//console.time('chain analyzer');
							//let boardLengths = new BoardAnalyzerChainLength( b );
							//console.timeEnd('chain analyzer');
							//$('#overlay').html( boardLengths.asHtmlString() );
							
							// Add an overlay showing impacts of next move
							console.time('count analyzer');
							let boardAnalysis  = new BoardAnalyzerCount( b );
							console.timeEnd('count analyzer');
							$('#overlay').html( boardAnalysis.asHtmlString() );
							
							// Show counts of players
							let counterBoard = new BoardAnalyzer( b );
							console.info( 'Player A: ' + counterBoard.getPlayerCount(PLAYERS.A) );
							console.info( 'Player B: ' + counterBoard.getPlayerCount(PLAYERS.B) );
							console.info( 'Player C: ' + counterBoard.getPlayerCount(PLAYERS.C) );
							console.info( 'Player D: ' + counterBoard.getPlayerCount(PLAYERS.D) );
							console.info( 'Player -: ' + counterBoard.getPlayerCount(PLAYERS.NONE) );
						}
					}
				});
			}
		});
	});
});

