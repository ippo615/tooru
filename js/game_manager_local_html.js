'use strict';

class GameManagerLocalHtml {
	constructor( board ){
		this.inputManagers = [];
		this.board = board;
		this._turnIndex = 0;
	}
	addInputManager(inputManager){
		this.inputManagers.push(inputManager);
	}
	start(){
		this._setupTurn();
	}

	isInputLegal( player, x, y ){
		if( this.board.getPieceAt(x,y).player == player ){
			return true;
		}
		return false;
	}
	
	doInput( player, x, y ){
		// I'm adding animation here, it should be for a "html" game manager, not a generic game manager
		// begin rotation animation
		let b = this.board;
		let that = this;
		anime({
			targets: ['#piece-'+x+'-'+y],
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
						if( anime.running.length <= 1 ){
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
							
							// Add an overlay showing impacts of next move
							console.time('count analyzer');
							let boardAnalysis  = new BoardAnalyzerCount( b );
							console.timeEnd('count analyzer');
							$('#overlay').html( boardAnalysis.asHtmlString() );

							that._finishTurn();
							that._setupTurn();
						}
					}
				});
			}
		});
	}
	
	_finishTurn(){
		this._turnIndex = (this._turnIndex+1) % this.inputManagers.length;
		
		// AI-DEBUGGING STUFF -----
		let canvasRender = new BoardRenderCanvas(
			this.board,
			[ this.inputManagers[0].player ],
			[
				this.inputManagers[1].player,
				this.inputManagers[2].player,
				this.inputManagers[3].player,
			],
			[ PLAYERS.NONE ]
		);
		document.getElementById('debug-area').appendChild( canvasRender.asCanvas() );
		// AI-DEBUGGING STUFF -----
		
		// TODO: if no valid moved -> end game OR skip to next player
	}
	_setupTurn(){
		// I add a setTimeout here because without it the turns would be infinitely
		// recursive (consider the case when you have all AI inputs that handle
		// computations immediately).
		let that = this;
		setTimeout(function(){
			that.inputManagers[that._turnIndex].setupInput();
		}, 10);
	}

}

