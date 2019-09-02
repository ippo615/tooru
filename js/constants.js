// ←↑→↓
'use strict';

const DIRECTIONS = Object.freeze({
	NORTH: 270,
	SOUTH: 90,
	EAST: 0,
	WEST: 180
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

