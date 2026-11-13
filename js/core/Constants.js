/**
 * Constants and theoretical definitions for the Pushdown Automaton (PDA).
 * 
 * Formal Definition: M = (Q, Σ, Γ, δ, q0, Z0, F)
 * In this implementation, acceptance is by empty stack / final state q_accept.
 */

export const PDA_STATES = Object.freeze({
    Q0: 'q0',               // Initial / Start state
    Q1: 'q1',               // Active reading / Processing state
    Q_ACCEPT: 'q_accept',   // Accepting state (reached when input exhausted and stack empty)
    Q_REJECT: 'q_reject'    // Trap / Error state
});

export const PDA_OPERATIONS = Object.freeze({
    INIT: 'INITIALIZE',
    PUSH: 'PUSH',
    POP: 'POP',
    ACCEPT: 'ACCEPT',
    REJECT: 'REJECT'
});

export const ERROR_CODES = Object.freeze({
    INVALID_CHAR: 'INVALID_CHAR',
    EMPTY_STACK_POP: 'EMPTY_STACK_POP',
    MISMATCHED_BRACKETS: 'MISMATCHED_BRACKETS',
    UNCLOSED_BRACKETS: 'UNCLOSED_BRACKETS'
});

export const BRACKET_MAP = Object.freeze({
    ')': '(',
    '}': '{',
    ']': '['
});

export const REVERSE_BRACKET_MAP = Object.freeze({
    '(': ')',
    '{': '}',
    '[': ']'
});

export const OPENING_BRACKETS = Object.freeze(new Set(['(', '{', '[']));
export const CLOSING_BRACKETS = Object.freeze(new Set([')', '}', ']']));
export const VALID_ALPHABET = Object.freeze(new Set(['(', ')', '{', '}', '[', ']']));
