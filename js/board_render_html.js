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
		let pieceHeight = '8px'; // chosen
		let pieceLength = '46px'; // chosen
		let pieceTop = '12px'; // (gridSize - pieceHeight)*0.5
		let pieceLeft = '16px'; // gridSize * 0.5
		
		let css = '';
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
		css += '	width: '+pieceLength+';';
		css += '	height: '+pieceHeight+';';
		css += '	transform-origin: left center;';
		css += '	z-index: 1;';
		css += '	background-color: #666;';
		css += '	pointer-events: none;';
		css += '}';
		return css;
	}
}

