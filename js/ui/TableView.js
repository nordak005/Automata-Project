/**
 * UI Component: Execution History Table View
 * Populates the transition table and coordinates row-click scrubbing.
 */

export class TableView {
    /**
     * @param {HTMLElement} tableBodyElement 
     * @param {Function} onRowClick - Callback triggered when a user clicks a row
     */
    constructor(tableBodyElement, onRowClick) {
        this.tbody = tableBodyElement;
        this.onRowClick = onRowClick;
    }

    /**
     * Populates the table with full trace step records.
     * @param {Array} steps - Complete steps array from PDASimulator
     */
    populate(steps) {
        this.tbody.innerHTML = '';

        steps.forEach((step, index) => {
            const tr = document.createElement('tr');
            tr.dataset.stepIndex = index;

            const stackStr = step.stackContents.length > 0 
                ? `[${step.stackContents.join(', ')}]` 
                : '∅';

            tr.innerHTML = `
                <td><strong>#${step.stepNumber}</strong></td>
                <td><code>${step.state}</code></td>
                <td><code>${this._escapeHtml(step.inputSymbol ?? 'ε')}</code></td>
                <td><code>${step.stackTop ? this._escapeHtml(step.stackTop) : '∅'}</code></td>
                <td><code>${stackStr}</code></td>
                <td><span class="op-badge ${step.operation}">${step.operation}</span></td>
                <td><code>${this._escapeHtml(step.transition)}</code></td>
                <td>${this._escapeHtml(step.explanation)}</td>
            `;

            tr.addEventListener('click', () => {
                if (typeof this.onRowClick === 'function') {
                    this.onRowClick(index);
                }
            });

            this.tbody.appendChild(tr);
        });
    }

    /**
     * Highlights the active row and scrolls it into view.
     * @param {number} activeIndex 
     */
    highlightRow(activeIndex) {
        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach((row, idx) => {
            if (idx === activeIndex) {
                row.classList.add('active-row');
                row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                row.classList.remove('active-row');
            }
        });
    }

    reset() {
        this.tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">
                    No execution data. Enter an expression and click "Check Expression".
                </td>
            </tr>
        `;
    }

    _escapeHtml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
