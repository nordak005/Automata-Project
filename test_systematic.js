/**
 * Systematic Test Suite for Pushdown Automata (PDA) Parentheses Checker.
 * 
 * Tests all 10 required categories:
 * 1. Empty input
 * 2. Single balanced pair
 * 3. Multiple balanced pairs
 * 4. Nested brackets
 * 5. Missing closing brackets
 * 6. Extra closing brackets
 * 7. Mismatched bracket types
 * 8. Deeply nested expressions
 * 9. Invalid characters
 * 10. Large input strings
 */

import { PDASimulator } from './js/core/PDASimulator.js';
import { ERROR_CODES, PDA_STATES } from './js/core/Constants.js';

const simulator = new PDASimulator();

export const testSuite = [
    // 1. Empty Input
    {
        category: '1. Empty Input',
        id: 'TC-1.1',
        input: '',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Empty string (ε) is trivially balanced in context-free language L'
    },

    // 2. Single Balanced Pair
    {
        category: '2. Single Balanced Pair',
        id: 'TC-2.1',
        input: '()',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Single pair of round parentheses'
    },
    {
        category: '2. Single Balanced Pair',
        id: 'TC-2.2',
        input: '{}',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Single pair of curly braces'
    },
    {
        category: '2. Single Balanced Pair',
        id: 'TC-2.3',
        input: '[]',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Single pair of square brackets'
    },

    // 3. Multiple Balanced Pairs (Consecutive)
    {
        category: '3. Multiple Balanced Pairs',
        id: 'TC-3.1',
        input: '()[]{}',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Consecutive alternating bracket types'
    },
    {
        category: '3. Multiple Balanced Pairs',
        id: 'TC-3.2',
        input: '()()()()',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Repeated homogeneous pairs'
    },
    {
        category: '3. Multiple Balanced Pairs',
        id: 'TC-3.3',
        input: '{}{}{}',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Repeated curly braces'
    },

    // 4. Nested Brackets
    {
        category: '4. Nested Brackets',
        id: 'TC-4.1',
        input: '{[()]}',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Strict symmetrical three-tier nesting'
    },
    {
        category: '4. Nested Brackets',
        id: 'TC-4.2',
        input: '(((())))',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Four-level homogeneous nested parentheses'
    },
    {
        category: '4. Nested Brackets',
        id: 'TC-4.3',
        input: '{[()]}[()]{()}',
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: 'Combined nested and consecutive structures'
    },

    // 5. Missing Closing Brackets (Unclosed Openers at EOF)
    {
        category: '5. Missing Closing Brackets',
        id: 'TC-5.1',
        input: '(',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        description: 'Single dangling opener'
    },
    {
        category: '5. Missing Closing Brackets',
        id: 'TC-5.2',
        input: '(((',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        description: 'Multiple unclosed opening parentheses'
    },
    {
        category: '5. Missing Closing Brackets',
        id: 'TC-5.3',
        input: '{[',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        description: 'Multi-type unclosed opening sequence'
    },
    {
        category: '5. Missing Closing Brackets',
        id: 'TC-5.4',
        input: '()()(',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        description: 'Valid prefix followed by dangling opener'
    },

    // 6. Extra Closing Brackets (Underflow)
    {
        category: '6. Extra Closing Brackets',
        id: 'TC-6.1',
        input: ')',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        description: 'Immediate closing bracket on empty stack'
    },
    {
        category: '6. Extra Closing Brackets',
        id: 'TC-6.2',
        input: '}',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        description: 'Immediate brace closing on empty stack'
    },
    {
        category: '6. Extra Closing Brackets',
        id: 'TC-6.3',
        input: '())',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        description: 'Balanced prefix with excess closer at index 2'
    },
    {
        category: '6. Extra Closing Brackets',
        id: 'TC-6.4',
        input: '()]{}',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        description: 'Unmatched closing bracket in middle of string'
    },

    // 7. Mismatched Bracket Types
    {
        category: '7. Mismatched Bracket Types',
        id: 'TC-7.1',
        input: '([)]',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        description: 'Interleaved mismatched brackets (classic non-CFL pattern)'
    },
    {
        category: '7. Mismatched Bracket Types',
        id: 'TC-7.2',
        input: '{]',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        description: 'Direct mismatch: opened { closed ]'
    },
    {
        category: '7. Mismatched Bracket Types',
        id: 'TC-7.3',
        input: '{[(])}',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        description: 'Deeply nested mismatch: expected ] but encountered )'
    },
    {
        category: '7. Mismatched Bracket Types',
        id: 'TC-7.4',
        input: '{[()}]',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        description: 'Late nesting reversal mismatch'
    },

    // 8. Deeply Nested Expressions
    {
        category: '8. Deeply Nested Expressions',
        id: 'TC-8.1',
        input: '('.repeat(50) + ')'.repeat(50),
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: '50-level homogeneous nested parentheses'
    },
    {
        category: '8. Deeply Nested Expressions',
        id: 'TC-8.2',
        input: '{[('.repeat(20) + ')]}'.repeat(20),
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: '60-level mixed alternating nested brackets'
    },
    {
        category: '8. Deeply Nested Expressions',
        id: 'TC-8.3',
        input: '('.repeat(50) + ']' + ')'.repeat(49),
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.MISMATCHED_BRACKETS,
        description: '50-level deep nesting with single mismatch at apex'
    },

    // 9. Invalid Characters
    {
        category: '9. Invalid Characters',
        id: 'TC-9.1',
        input: '(a+b)',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        description: 'Algebraic identifiers inside brackets'
    },
    {
        category: '9. Invalid Characters',
        id: 'TC-9.2',
        input: '( )',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        description: 'Whitespace inside brackets'
    },
    {
        category: '9. Invalid Characters',
        id: 'TC-9.3',
        input: '12345',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        description: 'Numeric string without brackets'
    },
    {
        category: '9. Invalid Characters',
        id: 'TC-9.4',
        input: '<>',
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.INVALID_CHAR,
        description: 'Angle brackets (not in alphabet Σ)'
    },

    // 10. Large Input Strings
    {
        category: '10. Large Input Strings',
        id: 'TC-10.1',
        input: '()'.repeat(500), // 1000 chars
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: '1,000 characters: 500 consecutive balanced pairs'
    },
    {
        category: '10. Large Input Strings',
        id: 'TC-10.2',
        input: '{[()]}'.repeat(200), // 1200 chars
        expectedVerdict: 'ACCEPTED',
        expectedState: PDA_STATES.Q_ACCEPT,
        expectedErrorCode: null,
        description: '1,200 characters: 200 repeated nested blocks'
    },
    {
        category: '10. Large Input Strings',
        id: 'TC-10.3',
        input: '()'.repeat(499) + ')(', // 1000 chars
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.EMPTY_STACK_POP,
        description: '1,000 characters: 998 valid characters followed by trailing underflow'
    },
    {
        category: '10. Large Input Strings',
        id: 'TC-10.4',
        input: '('.repeat(500),
        expectedVerdict: 'REJECTED',
        expectedState: PDA_STATES.Q_REJECT,
        expectedErrorCode: ERROR_CODES.UNCLOSED_BRACKETS,
        description: '500 consecutive unclosed open brackets'
    }
];

// Execution and Reporting
console.log('========================================================================================');
console.log('       AUTOMATED SYSTEMATIC TEST SUITE: PDA BALANCED PARENTHESES CHECKER                ');
console.log('========================================================================================\n');

let total = testSuite.length;
let passed = 0;
let failed = 0;
const results = [];

const startTime = Date.now();

for (const tc of testSuite) {
    const t0 = performance.now();
    const res = simulator.simulate(tc.input);
    const elapsedMs = (performance.now() - t0).toFixed(2);

    const matchVerdict = res.verdict === tc.expectedVerdict;
    const matchState = res.finalState === tc.expectedState;
    const matchError = tc.expectedErrorCode ? res.error?.code === tc.expectedErrorCode : res.error === null;

    // Consistency Check: Stack empty check vs verdict
    let consistencyPass = true;
    if (res.verdict === 'ACCEPTED') {
        const lastStep = res.steps[res.steps.length - 1];
        if (lastStep.stackContents.length !== 0 || lastStep.operation !== 'ACCEPT') {
            consistencyPass = false;
        }
    } else {
        const lastStep = res.steps[res.steps.length - 1];
        if (lastStep.operation !== 'REJECT') {
            consistencyPass = false;
        }
    }

    const testPassed = matchVerdict && matchState && matchError && consistencyPass;

    if (testPassed) {
        passed++;
    } else {
        failed++;
    }

    results.push({
        id: tc.id,
        category: tc.category,
        inputSample: tc.input.length > 25 ? `${tc.input.slice(0, 12)}...${tc.input.slice(-12)} (len=${tc.input.length})` : `"${tc.input}"`,
        expected: tc.expectedVerdict,
        actual: res.verdict,
        steps: res.totalSteps,
        timeMs: elapsedMs,
        status: testPassed ? 'PASS' : 'FAIL',
        explanation: tc.description,
        errorDetail: res.error ? res.error.code : 'None'
    });
}

const totalTimeMs = Date.now() - startTime;

// Print Results Table
console.log(
    'ID'.padEnd(8) +
    'Category'.padEnd(30) +
    'Input'.padEnd(28) +
    'Expected'.padEnd(10) +
    'Actual'.padEnd(10) +
    'Steps'.padEnd(8) +
    'Time'.padEnd(10) +
    'Status'
);
console.log('-'.repeat(112));

results.forEach(r => {
    const statusCol = r.status === 'PASS' ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(
        r.id.padEnd(8) +
        r.category.padEnd(30) +
        r.inputSample.padEnd(28) +
        r.expected.padEnd(10) +
        r.actual.padEnd(10) +
        String(r.steps).padEnd(8) +
        `${r.timeMs}ms`.padEnd(10) +
        statusCol
    );
});

console.log('='.repeat(112));
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed} | TOTAL EXECUTION TIME: ${totalTimeMs}ms`);
console.log('='.repeat(112));

if (failed > 0) {
    process.exit(1);
}
