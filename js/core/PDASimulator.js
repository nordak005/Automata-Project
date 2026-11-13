/**
 * Pushdown Automaton (PDA) Core Simulation Engine for Balanced Parentheses.
 * 
 * Demonstrates:
 * - Deterministic Pushdown Automaton (DPDA) logic
 * - LIFO Stack state tracking
 * - Step-by-step trace generation with complete historical snapshots
 * - Strict character-by-character processing
 * - Academic delta transition explanations
 */

import { Stack } from './Stack.js';
import {
    PDA_STATES,
    PDA_OPERATIONS,
    ERROR_CODES,
    BRACKET_MAP,
    REVERSE_BRACKET_MAP,
    OPENING_BRACKETS,
    CLOSING_BRACKETS,
    VALID_ALPHABET
} from './Constants.js';

export class PDASimulator {
    constructor() {
        this._stack = new Stack();
    }

    /**
     * Executes the PDA simulation on an input string.
     * 
     * @param {string} inputString - The raw bracket string to evaluate.
     * @returns {Object} Complete simulation result with trace steps, final verdict, and diagnostics.
     */
    simulate(inputString) {
        if (typeof inputString !== 'string') {
            throw new TypeError(`Expected input to be a string, but received ${typeof inputString}`);
        }

        this._stack.clear();
        const steps = [];
        let currentState = PDA_STATES.Q0;
        let isAccepted = false;
        let finalError = null;

        // Step 0: Initialization of PDA
        currentState = PDA_STATES.Q1;
        steps.push({
            stepNumber: 0,
            state: PDA_STATES.Q0,
            nextState: PDA_STATES.Q1,
            inputIndex: -1,
            inputSymbol: 'ε',
            stackContents: this._stack.getSnapshot(),
            stackTop: this._stack.peek(),
            stackSize: this._stack.size(),
            operation: PDA_OPERATIONS.INIT,
            transition: 'δ(q0, ε, ε) -> (q1, ε)',
            explanation: 'Initialized PDA in state q0 with empty stack. Transitioned to active processing state q1.',
            error: null
        });

        // Handle string evaluation character-by-character
        let halted = false;

        for (let i = 0; i < inputString.length; i++) {
            const symbol = inputString[i];
            const stateBefore = currentState;
            const topBefore = this._stack.peek();

            const topFormatted = topBefore ? `'${topBefore}'` : 'ε';

            // Check 1: Unsupported character detection
            if (!VALID_ALPHABET.has(symbol)) {
                currentState = PDA_STATES.Q_REJECT;
                finalError = {
                    code: ERROR_CODES.INVALID_CHAR,
                    message: `Unsupported character '${symbol}' encountered at index ${i}. Only '()', '{}', and '[]' are permitted.`,
                    index: i,
                    symbol: symbol
                };

                steps.push({
                    stepNumber: steps.length,
                    state: stateBefore,
                    nextState: currentState,
                    inputIndex: i,
                    inputSymbol: symbol,
                    stackContents: this._stack.getSnapshot(),
                    stackTop: topBefore,
                    stackSize: this._stack.size(),
                    operation: PDA_OPERATIONS.REJECT,
                    transition: `δ(${stateBefore}, '${symbol}', ${topFormatted}) -> (${currentState}, trap)`,
                    explanation: `Input symbol '${symbol}' is not part of the language alphabet Σ. Trapped to ${currentState}.`,
                    error: finalError
                });

                halted = true;
                break;
            }

            // Check 2: Opening bracket -> PUSH
            if (OPENING_BRACKETS.has(symbol)) {
                this._stack.push(symbol);
                currentState = PDA_STATES.Q1;

                steps.push({
                    stepNumber: steps.length,
                    state: stateBefore,
                    nextState: currentState,
                    inputIndex: i,
                    inputSymbol: symbol,
                    pushedSymbol: symbol,
                    poppedSymbol: null,
                    stackContents: this._stack.getSnapshot(),
                    stackTop: symbol,
                    stackSize: this._stack.size(),
                    operation: PDA_OPERATIONS.PUSH,
                    transition: `δ(${stateBefore}, '${symbol}', ${topFormatted}) -> (${currentState}, PUSH('${symbol}'))`,
                    explanation: `Read opening bracket '${symbol}' at index ${i}. Pushed '${symbol}' onto the stack.`,
                    error: null
                });
            }
            // Check 3: Closing bracket -> Check top and POP or REJECT
            else if (CLOSING_BRACKETS.has(symbol)) {
                // Underflow check: Closing bracket on empty stack
                if (this._stack.isEmpty()) {
                    currentState = PDA_STATES.Q_REJECT;
                    finalError = {
                        code: ERROR_CODES.EMPTY_STACK_POP,
                        message: `Unmatched closing bracket '${symbol}' at index ${i}: stack is empty (underflow).`,
                        index: i,
                        symbol: symbol
                    };

                    steps.push({
                        stepNumber: steps.length,
                        state: stateBefore,
                        nextState: currentState,
                        inputIndex: i,
                        inputSymbol: symbol,
                        pushedSymbol: null,
                        poppedSymbol: null,
                        stackContents: this._stack.getSnapshot(),
                        stackTop: null,
                        stackSize: 0,
                        operation: PDA_OPERATIONS.REJECT,
                        transition: `δ(${stateBefore}, '${symbol}', ε) -> (${currentState}, underflow)`,
                        explanation: `Closing bracket '${symbol}' found at index ${i}, but stack is empty. No matching opener exists.`,
                        error: finalError
                    });

                    halted = true;
                    break;
                }

                // Non-empty stack: Verify matching bracket
                const expectedOpener = BRACKET_MAP[symbol];
                if (topBefore === expectedOpener) {
                    this._stack.pop();
                    currentState = PDA_STATES.Q1;

                    steps.push({
                        stepNumber: steps.length,
                        state: stateBefore,
                        nextState: currentState,
                        inputIndex: i,
                        inputSymbol: symbol,
                        pushedSymbol: null,
                        poppedSymbol: topBefore,
                        stackContents: this._stack.getSnapshot(),
                        stackTop: this._stack.peek(),
                        stackSize: this._stack.size(),
                        operation: PDA_OPERATIONS.POP,
                        transition: `δ(${stateBefore}, '${symbol}', '${topBefore}') -> (${currentState}, POP('${topBefore}'))`,
                        explanation: `Read closing bracket '${symbol}' at index ${i}. Matches top of stack '${topBefore}'. Popped '${topBefore}'.`,
                        error: null
                    });
                } else {
                    // Mismatched bracket types
                    currentState = PDA_STATES.Q_REJECT;
                    const expectedCloser = REVERSE_BRACKET_MAP[topBefore];
                    finalError = {
                        code: ERROR_CODES.MISMATCHED_BRACKETS,
                        message: `Mismatched bracket at index ${i}: found '${symbol}', but top of stack was '${topBefore}' (expected '${expectedCloser}').`,
                        index: i,
                        symbol: symbol,
                        expectedCloser: expectedCloser,
                        foundOpener: topBefore
                    };

                    steps.push({
                        stepNumber: steps.length,
                        state: stateBefore,
                        nextState: currentState,
                        inputIndex: i,
                        inputSymbol: symbol,
                        stackContents: this._stack.getSnapshot(),
                        stackTop: topBefore,
                        stackSize: this._stack.size(),
                        operation: PDA_OPERATIONS.REJECT,
                        transition: `δ(${stateBefore}, '${symbol}', '${topBefore}') -> (${currentState}, mismatch)`,
                        explanation: `Mismatched bracket at index ${i}: '${symbol}' does not match stack top '${topBefore}'.`,
                        error: finalError
                    });

                    halted = true;
                    break;
                }
            }
        }

        // End of input processing (ε-transition)
        if (!halted) {
            const stateBefore = currentState;
            const topBefore = this._stack.peek();

            if (this._stack.isEmpty()) {
                // Accepted: All symbols matched and stack returned to empty
                currentState = PDA_STATES.Q_ACCEPT;
                isAccepted = true;

                steps.push({
                    stepNumber: steps.length,
                    state: stateBefore,
                    nextState: currentState,
                    inputIndex: inputString.length,
                    inputSymbol: 'ε',
                    stackContents: [],
                    stackTop: null,
                    stackSize: 0,
                    operation: PDA_OPERATIONS.ACCEPT,
                    transition: `δ(${stateBefore}, ε, ε) -> (${currentState}, ε)`,
                    explanation: inputString.length === 0
                        ? 'Empty string (ε) is trivially balanced. Stack is empty. Input accepted.'
                        : 'End of input reached (ε). Stack is completely empty. String is fully balanced and accepted.',
                    error: null
                });
            } else {
                // Rejected: Unclosed opening brackets remain on stack
                currentState = PDA_STATES.Q_REJECT;
                isAccepted = false;
                const unclosedList = this._stack.getSnapshot();

                finalError = {
                    code: ERROR_CODES.UNCLOSED_BRACKETS,
                    message: `Input ended with ${unclosedList.length} unclosed opening bracket(s): [${unclosedList.join(', ')}].`,
                    index: inputString.length,
                    symbol: 'ε',
                    unclosedBrackets: unclosedList
                };

                steps.push({
                    stepNumber: steps.length,
                    state: stateBefore,
                    nextState: currentState,
                    inputIndex: inputString.length,
                    inputSymbol: 'ε',
                    stackContents: unclosedList,
                    stackTop: topBefore,
                    stackSize: unclosedList.length,
                    operation: PDA_OPERATIONS.REJECT,
                    transition: `δ(${stateBefore}, ε, '${topBefore}') -> (${currentState}, unclosed)`,
                    explanation: `End of input reached (ε), but stack is not empty (${unclosedList.length} unclosed opener(s) remaining). Trapped to ${currentState}.`,
                    error: finalError
                });
            }
        }

        return {
            input: inputString,
            isAccepted: isAccepted,
            verdict: isAccepted ? 'ACCEPTED' : 'REJECTED',
            currentState: currentState,
            finalState: currentState,
            totalSteps: steps.length,
            steps: steps,
            error: finalError
        };
    }
}
