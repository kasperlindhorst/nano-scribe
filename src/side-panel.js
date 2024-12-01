import { summarizeText } from './summarizer.js';
import { generatePromptResponse } from './prompt.js';
import { createWriter, createRewriter } from './writer.js';
import { marked } from '../node_modules/marked/lib/marked.esm.js';

/**
 * Initializes the application once the DOM content is fully loaded.
 * Sets up tabs and restores the last active tab from localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupSummarizeTab();
    setupPromptTab();
    setupTabNavigation();
    setupWriterTab();
    setupRewriterTab();

    const lastActiveTab = localStorage.getItem('lastActiveTab') || 'promptSection';
    document.querySelector(`.tab-button[data-target="${lastActiveTab}"]`).click();
});

/**
 * Handles the Enter key press event for various input fields.
 * @param {KeyboardEvent} event - The keyboard event.
 */
const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (event.target.id === 'chatInput') {
            document.getElementById('chatButton').click();
        } else if (event.target.id === 'textInput') {
            document.getElementById('summarizeButton').click();
        } else if (event.target.id === 'writerInput') {
            document.getElementById('writeButton').click();
        }
    } else if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        if (event.target.id === 'chatInput') {
            document.getElementById('explainButton').click();
        } else if (event.target.id === 'writerInput') {
            document.getElementById('rewriteButton').click();
        }
    }
};

const textInput = document.getElementById('textInput');
const writerInput = document.getElementById('writerInput');

document.getElementById('chatInput').addEventListener('keydown', handleEnterKeyPress);
textInput.addEventListener('keydown', handleEnterKeyPress);
writerInput.addEventListener('keydown', handleEnterKeyPress);

/**
 * Sets up tab navigation functionality.
 * Adds click event listeners to tab buttons to switch between sections.
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const sections = document.querySelectorAll('.section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            sections.forEach(section => {
                if (section.id === target) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            localStorage.setItem('lastActiveTab', target);
        });
    });
}

/**
 * Sets up an input box with auto-resizing and clear button functionality.
 * @param {HTMLElement} inputElement - The input element to set up.
 * @param {HTMLElement} clearButton - The button to clear the input.
 */
function setupInputBox(inputElement, clearButton) {
    const adjustInputHeight = () => {
        inputElement.style.height = 'auto';
        inputElement.style.height = `${inputElement.scrollHeight}px`;
    };

    const resetInputHeight = () => {
        inputElement.style.height = 'auto';
        inputElement.style.height = '10px';
    };

    inputElement.addEventListener('input', adjustInputHeight);

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            inputElement.value = '';
            resetInputHeight();
        });
    }

    inputElement.addEventListener('drop', (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text').trim();
        inputElement.value = data;
        adjustInputHeight();
    });
}

/**
 * Listens for messages from the Chrome runtime and opens the prompt tab if the action is 'openPromptTab'.
 * @param {Object} message - The message received.
 * @param {Object} sender - The sender of the message.
 * @param {Function} sendResponse - The function to send a response.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPromptTab') {
        openPromptTab(message.text, message.summary);
    }
});

/**
 * Retrieves the summarizer settings from the DOM.
 * @returns {Object} The summarizer settings.
 */
function getSummarizerSettings() {
    const type = document.getElementById('summarizerType').value;
    const length = document.getElementById('summarizeLength').value;
    return { type, length };
}

/**
 * Opens the prompt tab and populates it with the provided text and summary.
 * @param {string} text - The text to display in the chat input.
 * @param {string} summary - The summary to display in the chat messages.
 */
function openPromptTab(text, summary) {
    document.getElementById('chatInput').value = text;
    document.getElementById('chatMessages').innerHTML = `<p>${summary}</p>`;
    document.querySelector('.tab-button[data-target="promptSection"]').click();
}

/**
 * Retrieves the writer settings from the DOM.
 * @returns {Object} The writer settings.
 */
function getWriterSettings() {
    const tone = document.getElementById('writerTone').value;
    const length = document.getElementById('writerLength').value;
    return { tone, length };
}

/**
 * Retrieves the rewriter settings from the DOM.
 * @returns {Object} The rewriter settings.
 */
function getRewriterSettings() {
    const tone = document.getElementById('rewriterTone').value;
    const length = document.getElementById('rewriteLength').value;
    return { tone, length };
}

/**
 * Sets up the prompt tab with input box, send button, and explain button functionality.
 */
function setupPromptTab() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('chatButton');
    const explainButton = document.getElementById('explainButton');
    const clearChatButton = document.getElementById('clearPrompt');

    if (!chatInput || !chatMessages || !sendButton || !clearChatButton) {
        console.error('One or more elements not found in the DOM');
        return;
    }

    setupInputBox(chatInput, clearChatButton);

    sendButton.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (message) {
            chatInput.value = '';
            chatInput.style.height = 'auto';

            try {
                chatMessages.innerHTML = 'Nano Scribe is thinking...';
                const response = await generatePromptResponse(message, 'chat');
                chatMessages.innerHTML = marked(response);
            } catch (error) {
                chatMessages.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            }
        }
    });

    explainButton.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (message) {
            chatInput.value = '';
            chatInput.style.height = 'auto';

            try {
                chatMessages.innerHTML = 'Nano Scribe is thinking...';
                const response = await generatePromptResponse(message, 'explain');
                chatMessages.innerHTML = marked(response);
            } catch (error) {
                chatMessages.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            }
        }
    });

    clearChatButton.addEventListener('click', () => {
        chatInput.value = '';
        chatInput.style.height = 'auto';
        chatMessages.innerHTML = '';
    });
}

/**
 * Sets up the summarize tab with input box, summarize button, and clear button functionality.
 */
function setupSummarizeTab() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'summarizeTextFromContentScript') {
            const textToSummarize = message.text;
            setupInputBox(textToSummarize, clearSummary);
            const { type, length } = getSummarizerSettings();
            // Process the text for summarization
            summarizeText(textToSummarize, type, length);
            sendResponse({ status: 'Text received and processed' });
        }
    });

    const summarizeButton = document.getElementById('summarizeButton');
    const clearSummary = document.getElementById('clearSummary');
    const textInput = document.getElementById('textInput');
    const summaryContent = document.getElementById('summaryContent');
    const summarizerType = document.getElementById('summarizerType');
    const summarizeLength = document.getElementById('summarizeLength');

    setupInputBox(textInput, clearSummary);

    const updateSettings = () => {
        const { type, length } = getSummarizerSettings();
        chrome.runtime.sendMessage({ action: 'updateSettings', type, length });
    };

    summarizerType.addEventListener('change', updateSettings);
    summarizeLength.addEventListener('change', updateSettings);

    summarizeButton.addEventListener('click', async () => {
        const textToSummarize = textInput.value.trim();
        const { type, length } = getSummarizerSettings();

        if (textToSummarize) {
            summaryContent.innerHTML = `<p>Nano Scribe is writing the summary...</p>`;
            try {
                const summary = await summarizeText(textToSummarize, type, length);
                summaryContent.innerHTML = marked(summary);
            } catch (error) {
                summaryContent.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            }
        } else {
            summaryContent.innerHTML = `<span style="color: red;">No text provided. Please enter text to summarize.</span>`;
        }
    });

    clearSummary.addEventListener('click', () => {
        textInput.value = '';
        summaryContent.innerHTML = '';
        textInput.style.height = 'auto';
        textInput.style.height = '10px';
    });
}

/**
 * Sets up the writer tab with input box, write button, and clear button functionality.
 */
function setupWriterTab() {
    const writeButton = document.getElementById('writeButton');
    const writerInput = document.getElementById('writerInput');
    const writerOutput = document.getElementById('writerOutput');
    const writerTone = document.getElementById('writerTone');
    const writerLength = document.getElementById('writerLength');
    const clearWriter = document.getElementById('clearWriter');

    if (!writeButton || !writerInput || !writerOutput || !writerTone || !writerLength) {
        console.error('One or more elements not found in the DOM');
        return;
    }

    setupInputBox(writerInput, clearWriter);
    let writer;

    const updateWriterSettings = async () => {
        try {
            const { tone, length } = getWriterSettings();
            writer = await createWriter({ tone, length });
        } catch (error) {
            console.error('Error creating writer:', error);
            writerOutput.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        }
    };

    writerTone.addEventListener('change', updateWriterSettings);
    writerLength.addEventListener('change', updateWriterSettings);

    writeButton.addEventListener('click', async () => {
        const prompt = writerInput.value.trim();
        if (!prompt) {
            writerOutput.innerHTML = '<span style="color: red;">No prompt provided. Please enter a prompt.</span>';
            return;
        }

        writerOutput.innerHTML = '<p>Nano Scribe is writing...</p>';
        try {
            if (!writer) {
                await updateWriterSettings();
            }
            const writtenText = await writer.write(prompt);
            writerOutput.innerHTML = marked.parse(writtenText);
        } catch (error) {
            writerOutput.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        }
    });

    clearWriter.addEventListener('click', () => {
        writerInput.value = '';
        writerOutput.innerHTML = '';
        writerInput.style.height = 'auto';
        writerInput.style.height = '10px';
    });
}

/**
 * Sets up the rewriter tab with input box, rewrite button, and clear button functionality.
 */
function setupRewriterTab() {
    const rewriteButton = document.getElementById('rewriteButton');
    const writerInput = document.getElementById('writerInput');
    const writerOutput = document.getElementById('writerOutput');
    const rewriterTone = document.getElementById('rewriterTone');
    const writerLength = document.getElementById('writerLength');

    let rewriter;

    const updateRewriterSettings = async () => {
        try {
            const { tone, length } = getRewriterSettings(true);
            rewriter = await createRewriter({ tone, length });
        } catch (error) {
            console.error('Error creating rewriter:', error);
            writerOutput.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        }
    };

    rewriterTone.addEventListener('change', updateRewriterSettings);
    writerLength.addEventListener('change', updateRewriterSettings);

    rewriteButton.addEventListener('click', async () => {
        const newInput = writerInput.value.trim();
        const textToRewrite = newInput || writerOutput.innerHTML.trim();
        if (!textToRewrite) {
            writerOutput.innerHTML = '<span style="color: red;">No text provided for rewriting. Please enter or generate text.</span>';
            return;
        }

        writerOutput.innerHTML = '<p>Nano Scribe is rewriting...</p>';
        try {
            if (!rewriter) {
                await updateRewriterSettings();
            }
            const rewrittenText = await rewriter.rewrite(textToRewrite);
            writerOutput.innerHTML = marked.parse(rewrittenText);
        } catch (error) {
            writerOutput.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        }
    });
}