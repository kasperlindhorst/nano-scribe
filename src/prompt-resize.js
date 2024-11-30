/**
 * Get DOM elements by their IDs.
 */
const chatInput = document.getElementById('chatInput');
const promptButton = document.getElementById('explainButton'); // Get the "Explain" button
const sendButton = document.getElementById('chatButton');     // Get the "Chat" button
const clearButton = document.getElementById('clearPrompt');   // Get the "Clear Result" button

/**
 * Add an event listener to the chat input element to adjust its height based on content.
 */
if (chatInput) {
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto'; // Reset height to auto
        chatInput.style.height = (chatInput.scrollHeight) + 'px'; // Set height to content height
    });
}

/**
 * Reset the height of the chat input element to fit its content.
 */
function resetChatInputHeight() {
    chatInput.style.height = 'auto'; // Reset to initial height
    chatInput.style.height = (chatInput.scrollHeight) + 'px'; // Set to content height
}

/**
 * Add event listeners to buttons to reset the chat input height when clicked.
 */
if (promptButton) {
    promptButton.addEventListener('click', resetChatInputHeight);
}

if (sendButton) {
    sendButton.addEventListener('click', resetChatInputHeight);
}

if (clearButton) {
    clearButton.addEventListener('click', resetChatInputHeight);
}

/**
 * Update the chat messages element with formatted content.
 * @param {string} content - The content to be displayed in the chat messages element.
 */
function updateChatMessages(content) {
    document.getElementById('chatMessages').innerHTML = content;
}