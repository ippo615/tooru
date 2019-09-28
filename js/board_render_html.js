'use strict';

class BoardRenderHtml extends BoardAnalyzer {
	constructor( board ){
		super( board );
	}
	
	asHtmlString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				// This can be modified to make other visualizations
				let piece = this.board.getPieceAt(x,y);
				let player = piece.player;
				let direction = piece.direction;
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
	generateCss(){
		let gridSize = '32px'; // chosen
		let connectorWidth = '8px'; // chosen
		let connectorLength = '46px'; // chosen
		let pieceTop = '12px'; // (gridSize - connectorWidth)*0.5
		let pieceLeft = '16px'; // gridSize * 0.5
		let overlayFontSize = '12px'; // chosen
		
		let css = '';
		// The following styles are for overlays of information that should go on top of a board
		css += '.board-stack {';
		css += '	position: relative;';
		css += '}';
		css += '.board {';
		css += '	position: absolute;';
		css += '	top:0;';
		css += '	left:0;';
		css += '}';
		css += '#overlay {';
		css += '	z-index: 1;';
		css += '}';
		css += '.overlay {';
		css += '	pointer-events: none;';
		css += '}';
		css += '.overlay .grid-space {';
		css += '	background: none;';
		css += '	text-align: center;';
		css += '	line-height: '+gridSize+';';
		css += '	font-size: '+overlayFontSize+';';
		css += '	text-shadow: 0 0 4px black;';
		css += '	color: white;';
		css += '}';
		// Stuff that only affects the board (not the overlays)
		css += '.board {';
		css += '	display: grid;';
		css += '	grid-template-columns: '+(new Array(this.width)).fill(gridSize).join(' ')+';';
		css += '	grid-template-rows: '+(new Array(this.height)).fill(gridSize).join(' ')+';';
		css += '	grid-gap: 10px;';
		css += '	padding: 10px;';
		css += '}';
		css += '.grid-space {';
		css += '	position: relative;';
		css += '	border-radius: 50%;';
		css += '	width: '+gridSize+';';
		css += '	height: '+gridSize+';';
		css += '	background-color: #666;';
		css += '}';
		css += '.piece {';
		css += '	position: absolute;';
		css += '	border-radius: 4px;';
		css += '	left: '+pieceLeft+';';
		css += '	top: '+pieceTop+';';
		css += '	width: '+connectorLength+';';
		css += '	height: '+connectorWidth+';';
		css += '	transform-origin: left center;';
		css += '	z-index: 1;';
		css += '	background-color: #666;';
		css += '	pointer-events: none;';
		css += '}';
		return css;
	}
}

