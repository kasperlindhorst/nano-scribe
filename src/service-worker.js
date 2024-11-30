/**
 * Default summarizer settings.
 * @type {{type: string, length: string}}
 */
let summarizerSettings = { type: 'key-points', length: 'short' };

/**
 * Default writer settings.
 * @type {{tone: string, length: string, format: string}}
 */
let writerSettings = { tone: 'default', length: 'short', format: 'default' };

/**
 * Default rewriter settings.
 * @type {{tone: string, length: string, format: string}}
 */
let rewriterSettings = { tone: 'same', length: 'same', format: 'default' };

chrome.runtime.onInstalled.addListener(() => {
    initializeDefaultSettings();
});

function initializeDefaultSettings() {
    chrome.storage.local.set({ summarizerSettings });
    chrome.storage.local.set({ writerSettings });
    chrome.storage.local.set({ rewriterSettings });
}

/**
 * Updates the specified settings and stores them in local storage.
 * @param {string} settingsType - The type of settings to update.
 * @param {...*} args - The settings values.
 */
function updateSettings(settingsType, ...args) {
    if (settingsType === 'summarizerSettings') {
        summarizerSettings = { type: args[0], length: args[1] };
        chrome.storage.local.set({ summarizerSettings });
    } else if (settingsType === 'writerSettings') {
        writerSettings = { tone: args[0], length: args[1], format: args[2] };
        chrome.storage.local.set({ writerSettings });
    } else if (settingsType === 'rewriteSettings') {
        rewriterSettings = { tone: args[0], length: args[1], format: args[2] };
        chrome.storage.local.set({ rewriterSettings });
    }
}