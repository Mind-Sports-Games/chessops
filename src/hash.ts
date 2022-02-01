import { PLAYERINDEXES, ROLES } from './types';
import { defined } from './util';
import { Board } from './board';
import { Setup, MaterialSide, Material, RemainingChecks } from './setup';

function rol32(n: number, left: number): number {
  return (n << left) | (n >>> (32 - left));
}

export function fxhash32(word: number, state = 0): number {
  return Math.imul(rol32(state, 5) ^ word, 0x9e3779b9);
}

export function hashBoard(board: Board, state = 0): number {
  state = fxhash32(board.p1.lo, fxhash32(board.p1.hi, state));
  for (const role of ROLES) state = fxhash32(board[role].lo, fxhash32(board[role].hi, state));
  return state;
}

export function hashMaterialSide(side: MaterialSide, state = 0): number {
  for (const role of ROLES) state = fxhash32(side[role], state);
  return state;
}

export function hashMaterial(material: Material, state = 0): number {
  for (const playerIndex of PLAYERINDEXES) state = hashMaterialSide(material[playerIndex], state);
  return state;
}

export function hashRemainingChecks(checks: RemainingChecks, state = 0): number {
  return fxhash32(checks.p1, fxhash32(checks.p2, state));
}

export function hashSetup(setup: Setup, state = 0): number {
  state = hashBoard(setup.board, state);
  if (setup.pockets) state = hashMaterial(setup.pockets, state);
  if (setup.turn === 'p1') state = fxhash32(1, state);
  state = fxhash32(setup.unmovedRooks.lo, fxhash32(setup.unmovedRooks.hi, state));
  if (defined(setup.epSquare)) state = fxhash32(setup.epSquare, state);
  if (setup.remainingChecks) state = hashRemainingChecks(setup.remainingChecks, state);
  return state;
}
