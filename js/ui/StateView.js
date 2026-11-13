/**
 * UI Component: PDA State Machine View
 * Highlights the active automaton state and renders the formal transition rule.
 */

export class StateView {
    constructor() {
        this.cards = {
            'q0': document.getElementById('state-q0'),
            'q1': document.getElementById('state-q1'),
            'q_accept': document.getElementById('state-q-accept'),
            'q_reject': document.getElementById('state-q-reject')
        };
        this.formulaEl = document.getElementById('transition-formula');
    }

    /**
     * Updates active state highlight and transition formula.
     * @param {string} state - Active state identifier
     * @param {string} transitionFormula - Formal mathematical notation
     */
    render(state, transitionFormula) {
        // Clear previous active classes
        Object.values(this.cards).forEach(card => {
            if (card) {
                card.classList.remove('active');
            }
        });

        // Activate matching state card
        const activeCard = this.cards[state];
        if (activeCard) {
            activeCard.classList.add('active');
        }

        // Render transition rule
        if (this.formulaEl) {
            this.formulaEl.textContent = transitionFormula || 'δ(q, a, X) -> (q\', γ)';
        }
    }

    /**
     * Resets state cards to idle.
     */
    reset() {
        Object.values(this.cards).forEach(card => {
            if (card) card.classList.remove('active');
        });
        if (this.formulaEl) {
            this.formulaEl.textContent = 'Awaiting simulation...';
        }
    }
}
