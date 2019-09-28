'use strict';

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

$(function(){

	let w = 20;
	let h = 20;

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
	var startAnimationDelta = 100;

	// Initial animation to show the board being setup/created
	for( let y=0, h=b.height; y<h; y+=1 ){
		for( let x=0, w=b.width; x<w; x+=1 ){
			let piece = b.getPieceAt(x,y);
			anime({
				targets: '#piece-'+x+'-'+y,
				rotate: piece.direction,
				background: PLAYER_CONNECTOR_COLORS[piece.player],
				duration: 1200,
				delay: x*startAnimationDelta+Math.random()*startAnimationDelta
			});
			anime.set( '#grid-space-'+x+'-'+y, {
				background: PLAYER_COLORS[piece.player],
			});
		}
	}
	
	let game = new GameManagerLocalHtml(b);
	game.addInputManager(new InputManagerLocalHtmlPlayer(PLAYERS.A, game, '#game'));
	game.addInputManager(new InputManagerAiLevel0(PLAYERS.B, game, '#game'));
	game.addInputManager(new InputManagerAiLevel0(PLAYERS.C, game, '#game'));
	game.addInputManager(new InputManagerAiLevel0(PLAYERS.D, game, '#game'));
	game.start();

	// Listen to this next time:
	// https://www.youtube.com/watch?v=BVeI1FPh6i8
	
});

