# Balanced Parentheses Checker Using Pushdown Automata (PDA)

An educational, college-level theoretical computer science web application that simulates and visualizes a **Deterministic Pushdown Automaton (DPDA)** checking for balanced parentheses across multiple bracket types: `()`, `{}`, and `[]`.

---

## 1. Theoretical Background

A regular finite-state automaton (DFA/NFA) cannot recognize balanced parentheses because it lacks unbounded memory to track arbitrarily nested matching pairs. 

This project demonstrates a **Deterministic Pushdown Automaton (DPDA)** operating over the generalized Dyck Language:
$$L = \{ w \in \{ (, ), \{, \}, [, ] \}^* \mid w \text{ is balanced} \}$$

### Formal 7-Tuple Definition
$$M = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$$

* **$Q$ (States):** $\{ q_0, q_1, q_{\text{accept}}, q_{\text{reject}} \}$
  * $q_0$: Initial state
  * $q_1$: Active reading state
  * $q_{\text{accept}}$: Final accepting state
  * $q_{\text{reject}}$: Dead/trap state
* **$\Sigma$ (Alphabet):** $\{ '(', ')', '{', '}', '[', ']' \}$
* **$\Gamma$ (Stack Alphabet):** $\{ '(', '{', '[', Z_0 \}$
* **$q_0$:** Initial start state
* **$Z_0$:** Initial stack bottom sentinel
* **$F$:** $\{ q_{\text{accept}} \}$
* **$\delta$:** Transition function $\delta : Q \times (\Sigma \cup \{ \epsilon \}) \times \Gamma \to Q \times \Gamma^*$

---

## 2. Project Architecture

The application strictly decouples the theoretical automata simulation engine from the DOM rendering layer:

```
balanced-pda-checker/
│
├── index.html                   # Semantic markup, panels, and accessibility tags
│
├── css/
│   ├── main.css                 # Dark developer design tokens, typography, and resets
│   ├── layout.css               # Responsive CSS Grid and Flexbox layouts
│   └── components.css           # Stack tube, tape reader, state cards, progress bar, animations
│
├── js/
│   ├── core/                    # Theoretical Automata Engine (Pure Logic, Zero DOM)
│   │   ├── Constants.js         # Formal states, alphabet sets, and error codes
│   │   ├── Stack.js             # LIFO Stack ADT with immutable historical snapshots
│   │   └── PDASimulator.js      # Character-by-character PDA simulator & trace generator
│   │
│   ├── ui/                      # DOM Visualizer Components
│   │   ├── StackView.js         # Animated vertical stack chamber with HUD & bracket color-coding
│   │   ├── StateView.js         # State node indicator and live δ transition equation
│   │   ├── TapeView.js          # Input tape reader with active head pointer
│   │   └── TableView.js         # Execution history table with row-click scrubbing
│   │
│   ├── controller/
│   │   └── PlaybackController.js# Stepping, progress bar, speed slider, auto-play timer
│   │
│   └── app.js                   # Application bootstrap, presets, export, and event binder
│
├── test_pda.js                  # Basic test suite (16 test cases)
├── test_systematic.js           # Comprehensive test suite (33 test cases across 10 categories)
└── package.json                 # ES module configuration
```

---

## 3. Key Features

1. **Authentic LIFO Stack Engine:** Genuine stack execution with `PUSH` and `POP` operations.
2. **Interactive Playback Controls:**
   * **Step Forward (`>`) / Step Backward (`<`):** Inspect every state transition step-by-step.
   * **Auto-Play / Pause (`Space`):** Watch the automaton run automatically.
   * **Scrubber Progress Bar:** Visual indicator showing execution position.
   * **Speed Slider:** Slow down to 1500ms or speed up to 150ms.
   * **Row Scrubbing:** Click any row in the execution history to jump to that moment in time.
3. **Tape Reader Head:** Visualizes each scanned symbol and marks consumed characters.
4. **Color-Coded Bracket Frames:** Distinct neon accents for parentheses (`cyan`), braces (`violet`), and brackets (`amber`).
5. **Stack HUD & Dynamic Animations:**
   * Real-time Stack Top ($X$), Scanned Symbol ($a$), and Operation badge.
   * Dropping PUSH animation and upward-ejecting ghost POP animation.
   * Error shake on REJECT.
6. **Precise Error Diagnostics:** Differentiates between:
   * **Type Mismatches:** e.g., opening with `{` and closing with `]`.
   * **Stack Underflows:** e.g., closing `)` when the stack is empty.
   * **Unclosed Openers:** e.g., input ends but stack still contains open brackets.
   * **Unsupported Characters:** e.g., algebraic letters or spaces.
7. **Trace Export:** One-click "Copy Trace (Markdown)" button to export execution tables directly into lab reports.
8. **Keyboard Shortcuts:**
   * `Space`: Toggle Auto-Play / Pause
   * `→`: Step Forward
   * `←`: Step Backward
   * `Enter`: Simulate input string

---

## 4. Running the Application

### Option A: Direct Browser Launch
Open [index.html](file:///c:/Users/Lenovo/Desktop/LLM/balanced-pda-checker/index.html) directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option B: Local Static Server (Node.js)
```bash
cd balanced-pda-checker
npx serve .
# or
npx http-server .
```

### Option C: Run Automated Tests
```bash
node balanced-pda-checker/test_systematic.js
```
*(Runs 33 comprehensive unit tests covering all 10 academic testing categories in ~10ms).*
