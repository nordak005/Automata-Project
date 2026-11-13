/**
 * Application Entry Point
 * Wires UI event listeners, presets, trace export, and controller orchestration.
 */

import { PDASimulator } from './core/PDASimulator.js';
import { StackView } from './ui/StackView.js';
import { StateView } from './ui/StateView.js';
import { TapeView } from './ui/TapeView.js';
import { TableView } from './ui/TableView.js';
import { PlaybackController } from './controller/PlaybackController.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core Engine
    const simulator = new PDASimulator();

    // 2. Initialize UI Views
    const stackView = new StackView();
    const stateView = new StateView();
    const tapeView = new TapeView(document.getElementById('tape-container'));

    let playbackController = null;
    let latestSimulationResult = null;

    const tableView = new TableView(
        document.getElementById('execution-table-body'),
        (stepIndex) => {
            if (playbackController) {
                playbackController.goToStep(stepIndex);
            }
        }
    );

    // 3. Initialize Playback Controller
    playbackController = new PlaybackController({
        stack: stackView,
        state: stateView,
        tape: tapeView,
        table: tableView
    });

    // 4. Bind Input Controls
    const inputField = document.getElementById('expression-input');
    const clearBtn = document.getElementById('btn-clear-input');
    const btnCheck = document.getElementById('btn-check');
    const btnReset = document.getElementById('btn-reset');
    const btnCopyTrace = document.getElementById('btn-copy-trace');
    const presetChips = document.querySelectorAll('.preset-chip');
    const toast = document.getElementById('toast-notification');

    const updateClearButton = () => {
        if (clearBtn) {
            clearBtn.style.display = inputField.value.length > 0 ? 'block' : 'none';
        }
    };

    const handleSimulation = (autoPlay = true) => {
        const expression = inputField.value;
        latestSimulationResult = simulator.simulate(expression);
        playbackController.loadTrace(latestSimulationResult, autoPlay);
        if (btnCopyTrace) btnCopyTrace.disabled = false;
    };

    if (btnCheck) {
        btnCheck.addEventListener('click', () => handleSimulation(true));
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            inputField.value = '';
            latestSimulationResult = null;
            if (btnCopyTrace) btnCopyTrace.disabled = true;
            updateClearButton();
            playbackController.reset();
            inputField.focus();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            inputField.value = '';
            updateClearButton();
            inputField.focus();
        });
    }

    if (inputField) {
        inputField.addEventListener('input', updateClearButton);
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSimulation(true);
            }
        });
        updateClearButton();
    }

    // 5. Bind Example Expression Chips
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.getAttribute('data-value');
            inputField.value = val;
            updateClearButton();
            handleSimulation(true);
        });
    });

    // 6. Copy Execution Trace to Clipboard (Markdown formatted for viva/reports)
    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    };

    if (btnCopyTrace) {
        btnCopyTrace.addEventListener('click', () => {
            if (!latestSimulationResult || !latestSimulationResult.steps) {
                showToast('No execution trace to copy!');
                return;
            }

            let md = `# Pushdown Automata (PDA) Execution Trace\n`;
            md += `**Input String:** \`${latestSimulationResult.input || 'ε'}\`\n`;
            md += `**Final Verdict:** **${latestSimulationResult.verdict}** (${latestSimulationResult.finalState})\n`;
            md += `**Total Steps:** ${latestSimulationResult.totalSteps}\n\n`;
            md += `| Step | State | Symbol | Stack Top | Stack Content | Operation | Transition Rule | Explanation |\n`;
            md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

            latestSimulationResult.steps.forEach(s => {
                const stackStr = s.stackContents.length > 0 ? `[${s.stackContents.join(', ')}]` : '∅';
                md += `| #${s.stepNumber} | \`${s.state}\` | \`${s.inputSymbol ?? 'ε'}\` | \`${s.stackTop ?? '∅'}\` | \`${stackStr}\` | **${s.operation}** | \`${s.transition}\` | ${s.explanation} |\n`;
            });

            if (latestSimulationResult.error) {
                md += `\n**Error Diagnostics:** ${latestSimulationResult.error.message}\n`;
            }

            navigator.clipboard.writeText(md).then(() => {
                showToast('✓ Execution trace copied to clipboard in Markdown format!');
            }).catch(() => {
                showToast('Failed to copy to clipboard.');
            });
        });
    }

    // 7. Keyboard Shortcuts for Academic Presentations
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === inputField) return;

        if (e.code === 'Space') {
            e.preventDefault();
            playbackController.togglePlay();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            playbackController.stepForward();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            playbackController.stepBackward();
        }
    });

    // Initial state setup
    playbackController.reset();
});
