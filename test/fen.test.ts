import { parseFen, makeFen, INITIAL_FEN } from '../src/fen';

test('parse fen', () => {
  const pos = parseFen(INITIAL_FEN)!;
  expect(pos.board['e2']).toEqual({role: 'pawn', color: 'white'});
  expect(pos.turn).toBe('white');
  expect(pos.epSquare).toBeUndefined();
  expect(pos.halfmoves).toBe(0);
  expect(pos.fullmoves).toBe(1);
});

test('parse invalid fen', () => {
  expect(parseFen('')).toBeUndefined();
  expect(parseFen('x')).toBeUndefined();
  expect(parseFen('8/8/8/8/8/8/8/8 w - - a82 1')).toBeUndefined();
  expect(parseFen('8/8/8/8/8/8/8/8 w - - 0 -2')).toBeUndefined();
  expect(parseFen('8/8/8/8/8/8/8/8 w · - 0 1')).toBeUndefined();
});

test('parse remaining checks', () => {
  const pos = parseFen('8/8/8/8/8/8/8/8 w - - 1+2 12 42')!;
  expect(pos.remainingChecks).toEqual({white: 1, black: 2});
  expect(pos.halfmoves).toBe(12);
  expect(pos.fullmoves).toBe(42);
});

test('parse lichess remaining checks', () => {
  const pos = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 2 +0+0')!;
  expect(pos.remainingChecks).toEqual({white: 3, black: 3});
  expect(pos.halfmoves).toBe(1);
  expect(pos.fullmoves).toBe(2);
});

test('make fen', () => {
  const pos = parseFen(INITIAL_FEN)!;
  expect(makeFen(pos)).toBe(INITIAL_FEN);
});

test('read and write crazyhouse fen', () => {
  const fen = 'rnbqk1nQ~/ppppp3/8/5p2/8/5N2/PPPPPPP1/RNBQKB1R/PPBRq b KQq - 0 6';
  const pos = parseFen(fen);
  expect(pos).toBeDefined();
  expect(makeFen(pos!, {promoted: true})).toBe(fen);
});
