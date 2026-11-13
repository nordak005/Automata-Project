/**
 * UI Component: Input Tape Reader View
 * Visualizes the input tape and read head pointer for each step.
 */

export class TapeView {
    /**
     * @param {HTMLElement} containerElement
     */
    constructor(containerElement) {
        this.container = containerElement;
    }

    /**
     * Renders the tape with an active pointer at currentIndex.
     * @param {string} inputString - Full input string
     * @param {number} activeIndex - Index of currently scanned character (-1 for start, length for EOF)
     */
    render(inputString, activeIndex) {
        this.container.innerHTML = '';

        if (!inputString || inputString.length === 0) {
            const cell = document.createElement('div');
            cell.className = 'tape-cell active';
            cell.innerHTML = '<span class="tape-cell-empty">ε</span>';
            this.container.appendChild(cell);
            return;
        }

        // Render each input symbol as a tape cell
        for (let i = 0; i < inputString.length; i++) {
            const cell = document.createElement('div');
            const isConsumed = i < activeIndex;
            const isActive = i === activeIndex;

            cell.className = `tape-cell ${isActive ? 'active' : ''} ${isConsumed ? 'consumed' : ''}`;
            cell.textContent = inputString[i];

            this.container.appendChild(cell);

            // Auto-scroll active cell into view
            if (isActive) {
                cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }

        // EOF cell (ε)
        const eofCell = document.createElement('div');
        const isEofActive = activeIndex >= inputString.length;
        eofCell.className = `tape-cell ${isEofActive ? 'active' : ''} ${activeIndex > inputString.length ? 'consumed' : ''}`;
        eofCell.innerHTML = '<span class="tape-cell-empty">ε</span>';
        this.container.appendChild(eofCell);

        if (isEofActive) {
            eofCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    reset() {
        this.container.innerHTML = '<div class="tape-cell tape-cell-empty">Awaiting expression...</div>';
    }
}
