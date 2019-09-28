'use strict';

class InputManagerLocalHtmlPlayer {
	constructor( player, gameManager, gameDomNode ){
		this.player = player;
		this.gameManager = gameManager;
		this.gameDomNode = gameDomNode;
	}
	
	setupInput(){
		// You should "reset" the dom events at the start and end of the user interaction
		// ie if you are waiting for a click, after the click has been validated as a legal
		// move then you should turn the input off and compute the result of the move.
		let that = this;
		let $gameDom = $(this.gameDomNode);
		$gameDom.off();
		$gameDom.on('click','.grid-space',function(e){
			let target = $(e.target).closest('.grid-space');
			let piece = target.find('.piece')[0];
			let grid_xy = target.data('xy').split(',');
			let x = parseInt(grid_xy[0]);
			let y = parseInt(grid_xy[1]);
			if( that.gameManager.isInputLegal( that.player, x, y ) ){
				$gameDom.off();
				that.gameManager.doInput( that.player, x, y );
			}
		});
	}

}

