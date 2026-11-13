/**
 * Pure Stack (LIFO) Data Structure for PDA simulation.
 * Ensures strict encapsulation and snapshot generation.
 */

export class Stack {
    constructor() {
        this._items = [];
    }

    /**
     * Push an element onto the top of the stack.
     * @param {string} element 
     */
    push(element) {
        this._items.push(element);
    }

    /**
     * Pop the top element from the stack.
     * @returns {string|null} The popped element, or null if the stack is empty.
     */
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this._items.pop();
    }

    /**
     * Inspect the element at the top of the stack without removing it.
     * @returns {string|null} The top element, or null if empty.
     */
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this._items[this._items.length - 1];
    }

    /**
     * Check if the stack is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this._items.length === 0;
    }

    /**
     * Current number of elements on the stack.
     * @returns {number}
     */
    size() {
        return this._items.length;
    }

    /**
     * Clears all items from the stack.
     */
    clear() {
        this._items = [];
    }

    /**
     * Returns an immutable copy of the stack elements (from bottom to top).
     * @returns {string[]} Cloned array of stack items.
     */
    getSnapshot() {
        return [...this._items];
    }
}
