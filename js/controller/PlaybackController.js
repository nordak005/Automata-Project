/**
 * Enhanced Playback & Orchestration Controller
 * Handles synchronized step-by-step navigation, auto-play intervals, speed control, and UI dispatching.
 */

export class PlaybackController {
    /**
     * @param {Object} views - References to UI view instances
     */
    constructor(views) {
        this.views = views;
        this.trace = null;
        this.currentStep = 0;
        this.isPlaying = false;
        this.timer = null;
        this.speedMs = 700;

        // UI elements
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.btnPlay = document.getElementById('btn-play');
        this.btnStart = document.getElementById('btn-start');
        this.btnEnd = document.getElementById('btn-end');
        this.stepInfo = document.getElementById('playback-step-info');
        this.progressBar = document.getElementById('step-progress-bar');
        this.verdictBanner = document.getElementById('verdict-banner');
        this.verdictStatus = document.getElementById('verdict-status');
        this.verdictDesc = document.getElementById('verdict-description');

        this._bindEvents();
    }

    _bindEvents() {
        if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.stepBackward());
        if (this.btnNext) this.btnNext.addEventListener('click', () => this.stepForward());
        if (this.btnPlay) this.btnPlay.addEventListener('click', () => this.togglePlay());
        if (this.btnStart) this.btnStart.addEventListener('click', () => this.goToStep(0));
        if (this.btnEnd) this.btnEnd.addEventListener('click', () => this.goToStep(this.trace ? this.trace.steps.length - 1 : 0));
        
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.speedMs = parseInt(e.target.value, 10);
                if (this.isPlaying) {
                    this.pause();
                    this.play();
                }
            });
        }
    }

    /**
     * Loads a new simulation trace result.
     * @param {Object} simulationResult - Result from PDASimulator
     * @param {boolean} autoStart - Whether to start auto-play immediately
     */
    loadTrace(simulationResult, autoStart = false) {
        this.pause();
        this.trace = simulationResult;
        this.currentStep = 0;

        // Populate the complete transition table
        this.views.table.populate(this.trace.steps);

        // Render initial step (Step 0)
        this.renderCurrentStep();

        if (autoStart) {
            this.play();
        }
    }

    /**
     * Navigates to a specific step index.
     * @param {number} stepIndex 
     */
    goToStep(stepIndex) {
        if (!this.trace || stepIndex < 0 || stepIndex >= this.trace.steps.length) return;
        this.currentStep = stepIndex;
        this.renderCurrentStep();
    }

    stepForward() {
        if (!this.trace) return;
        if (this.currentStep < this.trace.steps.length - 1) {
            this.currentStep++;
            this.renderCurrentStep();
        } else {
            this.pause();
        }
    }

    stepBackward() {
        if (!this.trace) return;
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderCurrentStep();
        }
    }

    play() {
        if (!this.trace || this.isPlaying) return;
        
        // If already at end, rewind to start
        if (this.currentStep >= this.trace.steps.length - 1) {
            this.currentStep = 0;
            this.renderCurrentStep();
        }

        this.isPlaying = true;
        this._updatePlayButton();

        this.timer = setInterval(() => {
            if (this.currentStep < this.trace.steps.length - 1) {
                this.stepForward();
            } else {
                this.pause();
            }
        }, this.speedMs);
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this._updatePlayButton();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    reset() {
        this.pause();
        this.trace = null;
        this.currentStep = 0;

        this.views.stack.reset();
        this.views.state.reset();
        this.views.tape.reset();
        this.views.table.reset();

        if (this.progressBar) this.progressBar.style.width = '0%';
        if (this.stepInfo) this.stepInfo.textContent = 'Step 0 of 0';
        if (this.verdictBanner) {
            this.verdictBanner.className = 'verdict-banner idle';
            this.verdictStatus.textContent = 'STATUS: AWAITING INPUT';
            this.verdictDesc.textContent = 'Enter a bracket string and click "Check Expression" to start the simulation.';
        }

        this._updateNavButtons();
    }

    /**
     * Synchronously renders the current step across all views.
     */
    renderCurrentStep() {
        if (!this.trace) return;

        const step = this.trace.steps[this.currentStep];
        const isFinalStep = this.currentStep === this.trace.steps.length - 1;

        // Detect popped symbol if operation is POP
        const poppedSymbol = step.poppedSymbol || (step.operation === 'POP' && this.currentStep > 0 ? this.trace.steps[this.currentStep - 1].stackTop : null);

        // 1. Stack Visualizer
        this.views.stack.render({
            stackContents: step.stackContents,
            operation: step.operation,
            currentSymbol: step.inputSymbol,
            stackTop: step.stackTop,
            explanation: step.explanation,
            poppedSymbol: poppedSymbol
        });

        // 2. State Diagram & Formula
        this.views.state.render(step.state, step.transition);

        // 3. Tape Reader Head
        this.views.tape.render(this.trace.input, step.inputIndex);

        // 4. Execution Table Row Highlight
        this.views.table.highlightRow(this.currentStep);

        // 5. Playback Counter & Progress Bar
        if (this.stepInfo) {
            this.stepInfo.textContent = `Step ${this.currentStep + 1} of ${this.trace.steps.length}`;
        }
        if (this.progressBar) {
            const percent = this.trace.steps.length > 1
                ? ((this.currentStep) / (this.trace.steps.length - 1)) * 100
                : 100;
            this.progressBar.style.width = `${percent}%`;
        }

        // 6. Verdict Banner Update
        this._renderVerdict(step, isFinalStep);

        this._updateNavButtons();
    }

    _renderVerdict(step, isFinalStep) {
        if (!this.verdictBanner) return;

        if (isFinalStep) {
            if (this.trace.isAccepted) {
                this.verdictBanner.className = 'verdict-banner accepted';
                this.verdictStatus.textContent = '✓ ACCEPTED (L(M))';
                this.verdictDesc.textContent = 'The input string is fully balanced and accepted by the Pushdown Automaton. All brackets matched and the stack is empty.';
            } else {
                this.verdictBanner.className = 'verdict-banner rejected';
                this.verdictStatus.textContent = '✗ REJECTED';
                const errorMsg = this.trace.error ? this.trace.error.message : 'String rejected by Automaton.';
                this.verdictDesc.textContent = `${errorMsg} (Halted at step ${this.currentStep + 1}).`;
            }
        } else {
            this.verdictBanner.className = 'verdict-banner idle';
            this.verdictStatus.textContent = `PROCESSING: ${step.operation}`;
            this.verdictDesc.textContent = step.explanation;
        }
    }

    _updateNavButtons() {
        const hasTrace = !!this.trace;
        const total = hasTrace ? this.trace.steps.length : 0;

        if (this.btnStart) this.btnStart.disabled = !hasTrace || this.currentStep === 0;
        if (this.btnPrev) this.btnPrev.disabled = !hasTrace || this.currentStep === 0;
        if (this.btnNext) this.btnNext.disabled = !hasTrace || this.currentStep >= total - 1;
        if (this.btnEnd) this.btnEnd.disabled = !hasTrace || this.currentStep >= total - 1;
        if (this.btnPlay) this.btnPlay.disabled = !hasTrace;
    }

    _updatePlayButton() {
        if (!this.btnPlay) return;
        if (this.isPlaying) {
            this.btnPlay.classList.add('active-play');
            this.btnPlay.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                <span>Pause</span>
            `;
        } else {
            this.btnPlay.classList.remove('active-play');
            this.btnPlay.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>Play</span>
            `;
        }
    }
}
