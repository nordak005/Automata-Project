/**
 * Enhanced Interactive Stack Visualization View
 * 
 * Features:
 * - Animated PUSH with drop-in keyframes
 * - Animated POP with upward ejection ghost frames
 * - Real-time Stack Top (X) inspector
 * - Synchronized Operation HUD (PUSH / POP / ERROR / ACCEPT)
 * - Shaking chamber animation on REJECT
 */

export class StackView {
    constructor() {
        this.chamber = document.getElementById('stack-chamber');
        this.topBadge = document.getElementById('hud-stack-top');
        this.depthBadge = document.getElementById('hud-stack-depth');
        this.opBadge = document.getElementById('hud-current-op');
        this.scannedCharBadge = document.getElementById('hud-scanned-char');
        this.explanationOpTag = document.getElementById('explanation-op-tag');
        this.explanationText = document.getElementById('explanation-text');
    }

    /**
     * Renders the current stack snapshot with contextual animations.
     * 
     * @param {Object} options
     * @param {string[]} options.stackContents - Current array of brackets (bottom to top)
     * @param {string} options.operation - 'PUSH' | 'POP' | 'INITIALIZE' | 'ACCEPT' | 'REJECT'
     * @param {string|null} options.currentSymbol - Input symbol currently read
     * @param {string|null} options.stackTop - Symbol at top of stack
     * @param {string} options.explanation - Narrative description
     * @param {string|null} [options.poppedSymbol=null] - Symbol that was popped (if POP operation)
     */
    render({ stackContents, operation, currentSymbol, stackTop, explanation, poppedSymbol = null }) {
        if (!this.chamber) return;

        // 1. Update Stack HUD Tiles
        this._updateHUD(stackContents, operation, currentSymbol, stackTop, explanation);

        // 2. Clear previous chamber content
        this.chamber.innerHTML = '';
        this.chamber.classList.remove('shake-error');

        // Handle error shake
        if (operation === 'REJECT') {
            this.chamber.classList.add('shake-error');
        }

        // 3. Render Empty Stack State
        if ((!stackContents || stackContents.length === 0) && (!poppedSymbol || operation !== 'POP')) {
            this.chamber.innerHTML = `
                <div class="stack-empty-placeholder">
                    <span>Stack is currently empty</span>
                    <span style="font-size: 0.75rem; opacity: 0.6;">(Sentinel Z₀ at base)</span>
                </div>
            `;
            return;
        }

        // 4. Render Stack Frames (bottom to top; CSS column-reverse places top at the top)
        stackContents.forEach((symbol, index) => {
            const isTop = index === stackContents.length - 1;
            const isJustPushed = isTop && operation === 'PUSH';

            const frame = document.createElement('div');
            frame.className = `stack-frame ${this._getBracketClass(symbol)} ${isTop ? 'top-frame' : ''} ${isJustPushed ? 'anim-push' : ''}`;

            frame.innerHTML = `
                <div class="stack-frame-details">
                    <span class="symbol-char">${this._escapeHtml(symbol)}</span>
                    <span class="stack-bracket-type">${this._getBracketTypeLabel(symbol)}</span>
                </div>
                <div>
                    ${isTop ? '<span class="top-pointer-badge">← TOP</span>' : `<span class="stack-frame-idx">#${index}</span>`}
                </div>
            `;

            this.chamber.appendChild(frame);
        });

        // 5. Render Animated POP Ghost Element (if POP occurred, animate the departing element lifting upward)
        if (operation === 'POP' && poppedSymbol) {
            const ghost = document.createElement('div');
            ghost.className = `stack-frame ${this._getBracketClass(poppedSymbol)} anim-pop-ghost`;
            ghost.innerHTML = `
                <div class="stack-frame-details">
                    <span class="symbol-char">${this._escapeHtml(poppedSymbol)}</span>
                    <span class="stack-bracket-type">POPPING...</span>
                </div>
                <div>
                    <span class="top-pointer-badge" style="background: rgba(168, 85, 247, 0.4); color: #fff;">POPPED ↑</span>
                </div>
            `;
            this.chamber.appendChild(ghost);
        }
    }

    /**
     * Updates top HUD badges and narrative text.
     * @private
     */
    _updateHUD(stackContents, operation, currentSymbol, stackTop, explanation) {
        // Stack Top
        if (this.topBadge) {
            this.topBadge.textContent = stackTop ? `'${stackTop}'` : '∅ (Empty)';
        }

        // Stack Depth
        if (this.depthBadge) {
            const size = stackContents ? stackContents.length : 0;
            this.depthBadge.textContent = `${size} element${size === 1 ? '' : 's'}`;
        }

        // Scanned Input Character
        if (this.scannedCharBadge) {
            this.scannedCharBadge.textContent = currentSymbol ? `'${currentSymbol}'` : 'ε';
        }

        // Current Operation Badge
        if (this.opBadge) {
            this.opBadge.className = `hud-value op-${operation.toLowerCase()}`;
            this.opBadge.textContent = operation;
        }

        // Narrative Explanation Callout
        if (this.explanationOpTag) {
            this.explanationOpTag.className = `explanation-op-indicator ${operation}`;
            this.explanationOpTag.textContent = operation;
        }

        if (this.explanationText) {
            this.explanationText.textContent = explanation || 'Waiting for execution step...';
        }
    }

    reset() {
        if (this.chamber) {
            this.chamber.className = 'stack-chamber';
            this.chamber.innerHTML = `
                <div class="stack-empty-placeholder">
                    <span>Stack is currently empty</span>
                    <span style="font-size: 0.75rem; opacity: 0.6;">(Awaiting simulation)</span>
                </div>
            `;
        }
        if (this.topBadge) this.topBadge.textContent = '∅ (Empty)';
        if (this.depthBadge) this.depthBadge.textContent = '0 elements';
        if (this.scannedCharBadge) this.scannedCharBadge.textContent = '-';
        if (this.opBadge) {
            this.opBadge.className = 'hud-value';
            this.opBadge.textContent = 'IDLE';
        }
        if (this.explanationOpTag) {
            this.explanationOpTag.className = 'explanation-op-indicator INITIALIZE';
            this.explanationOpTag.textContent = 'IDLE';
        }
        if (this.explanationText) {
            this.explanationText.textContent = 'Enter an expression and click "Check Expression" or use Step Forward.';
        }
    }

    _getBracketClass(symbol) {
        switch (symbol) {
            case '(':
            case ')':
                return 'paren';
            case '{':
            case '}':
                return 'brace';
            case '[':
            case ']':
                return 'bracket';
            default:
                return '';
        }
    }

    _getBracketTypeLabel(symbol) {
        switch (symbol) {
            case '(':
            case ')':
                return 'Parenthesis';
            case '{':
            case '}':
                return 'Brace';
            case '[':
            case ']':
                return 'Bracket';
            default:
                return 'Symbol';
        }
    }

    _escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
