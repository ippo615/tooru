'use strict';

class InputManagerAiLevel0 {
	constructor( player, gameManager ){
		this.player = player;
		this.gameManager = gameManager;
	}
	
	_analysisFilter( board, x, y ){
		if( this.player == board.getPieceAt(x,y).player ){
			return true;
		}
		return false;
	}
	
	setupInput(){
		// Since this is artificial intelligence, we do not need to wait for user input
		// or any asynchronous event. We simply compute the move that we want to make
		// and make it.
		// TODO: the AI should only generate valid moves... but in case it doesn't we
		// should make it keep trying until it makes a valid move.
		let boardAnalysis = new BoardAnalyzerCount( this.gameManager.board, this._analysisFilter.bind(this), -1 );
		let maxValue = boardAnalysis.getMaxValue();
		let choices = boardAnalysis.getLocationsWithValue( maxValue );
		let choice = choices[ Math.floor( Math.random()*choices.length ) ];
		let x = choice[0];
		let y = choice[1];

		if( this.gameManager.isInputLegal( this.player, x, y ) ){
			this.gameManager.doInput( this.player, x, y );
		}
	}

}
