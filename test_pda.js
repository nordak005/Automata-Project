/**
 * Automated test suite for the PDA Core Engine.
 */

import { PDASimulator } from './js/core/PDASimulator.js';
import { ERROR_CODES, PDA_STATES } from './js/core/Constants.js';

const simulator = new PDASimulator();

const testCases = [
    // --- ACCEPTED CASES ---
    {
        name: 'Empty string (ε)',
        input: '',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Simple Parentheses ()',
        input: '()',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Simple Braces {}',
        input: '{}',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Simple Brackets []',
        input: '[]',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Consecutive Balanced Pairs ()[]{}',
        input: '()[]{}',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Deep Nested Balanced {[()]}',
        input: '{[()]}',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },
    {
        name: 'Complex Nested & Consecutive {[]}([{}])',
        input: '{[]}([{}])',
        expectedAccepted: true,
        expectedState: PDA_STATES.Q_ACCEPT
    },

    // --- REJECTED CASES: UNDERFLOW (Closing on empty stack) ---
    {
        name: 'Single closing bracket )',
        input: ')',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        expectedState: PDA_STATES.Q_REJECT
    },
    {
        name: 'Prefix balanced followed by excess closer ())',
        input: '())',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        expectedState: PDA_STATES.Q_REJECT
    },

    // --- REJECTED CASES: MISMATCHED TYPES ---
    {
        name: 'Interleaved mismatch ([)]',
        input: '([)]',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        expectedState: PDA_STATES.Q_REJECT
    },
    {
        name: 'Nested mismatch {[(])}',
        input: '{[(])}',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        expectedState: PDA_STATES.Q_REJECT
    },

    // --- REJECTED CASES: UNCLOSED OPENERS (Non-empty stack at EOF) ---
    {
        name: 'Single unclosed opening bracket (',
        input: '(',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        expectedState: PDA_STATES.Q_REJECT
    },
    {
        name: 'Multiple unclosed opening brackets ((({',
        input: '((({',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        expectedState: PDA_STATES.Q_REJECT
    },
    {
        name: 'Balanced segment with trailing unclosed {[]}(',
        input: '{[]}(',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        expectedState: PDA_STATES.Q_REJECT
    },

    // --- REJECTED CASES: INVALID / UNSUPPORTED CHARACTERS ---
    {
        name: 'String with spaces "( )"',
        input: '( )',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        expectedState: PDA_STATES.Q_REJECT
    },
    {
        name: 'String with algebraic letters "(a+b)"',
        input: '(a+b)',
        expectedAccepted: false,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        expectedState: PDA_STATES.Q_REJECT
    }
];

let passed = 0;
let failed = 0;

console.log('====================================================');
console.log('   PUSH DOWN AUTOMATA (PDA) CORE ENGINE TEST SUITE  ');
console.log('====================================================\n');

for (const tc of testCases) {
    const result = simulator.simulate(tc.input);

    const acceptMatches = result.isAccepted === tc.expectedAccepted;
    const stateMatches = result.finalState === tc.expectedState;
    const errorMatches = tc.expectedErrorCode ? result.error?.code === tc.expectedErrorCode : true;

    if (acceptMatches && stateMatches && errorMatches) {
        console.log(`[PASS] ${tc.name}`);
        console.log(`       Input: "${tc.input}" -> Verdict: ${result.verdict} in ${result.totalSteps} steps`);
        passed++;
    } else {
        console.error(`[FAIL] ${tc.name}`);
        console.error(`       Input: "${tc.input}"`);
        console.error(`       Expected: accepted=${tc.expectedAccepted}, state=${tc.expectedState}, error=${tc.expectedErrorCode}`);
        console.error(`       Actual:   accepted=${result.isAccepted}, state=${result.finalState}, error=${result.error?.code}`);
        failed++;
    }
}

console.log('\n----------------------------------------------------');
console.log(`TOTAL: ${testCases.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('----------------------------------------------------');

if (failed > 0) {
    process.exit(1);
}
