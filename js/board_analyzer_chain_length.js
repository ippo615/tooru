'use strict';

class BoardAnalyzerChainLength extends BoardAnalyzer{
	constructor( board ){
		super( board );
		let rows = (new Array(this.height)).fill(undefined).map( _ => new Array(this.width) );
		for( let y=0, h=this.height; y<h; y+=1 ){
			for( let x=0, w=this.width; x<w; x+=1 ){
				rows[y][x] = this.computeChainSizeAt(x,y);
			}
		}
		this.data = rows;
	}
	computeChainSizeAt(x,y){
		let count = 0;
		let depthMap = this.board.getDepthMapFrom( x, y );
		for( let d = 0, dMax = depthMap.length; d<dMax; d+=1 ){
			count += depthMap[d].length;
		}
		return count;
	}
	asHtmlString(){
		let rows = new Array(this.height);
		for( let y=0, h=this.height; y<h; y+=1 ){
			let row = new Array(this.width);
			for( let x=0, w=this.width; x<w; x+=1 ){
				let dom = '';
				dom += '<div class="grid-space">'+this.data[y][x]+'</div>';
				row[x] = dom;
			}
			rows[y] = row.join('');
		}
		return rows.join('\n');
	}
}

