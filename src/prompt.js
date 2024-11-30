/**
 * Creates a session with the Google Gemini Nano Prompt AI and waits until the model's capabilities are 'readily' available.
 *
 * @returns {Promise<Object>} A promise that resolves to the created session.
 */
async function createSession() {
    let session = await ai.languageModel.create();
    while ((await ai.languageModel.capabilities()).available !== 'readily') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before rechecking
    }
    await session.ready;
    return session;
}

/**
 * Generates a prompt response from Prompt AI based on the selected text and type.
 *
 * @param {string} selectedText - The text to be explained by the Gemini Nano.
 * @param {string} [type='explain'] - The type of explanation required. Can be 'like5', 'short', 'specialist', or 'explain'.
 * @returns {Promise<string>} A promise that resolves to the response from Gemini Nano
 */
export async function generatePromptResponse(selectedText, type = 'explain') {
    const canPrompt = await ai.languageModel.capabilities();
    const session = canPrompt && canPrompt.available === 'readily'
        ? await ai.languageModel.create()
        : await createSession();

    const promptTexts = {
        like5: `Explain this to me like I am 5: ${selectedText}`,
        short: `Explain this to me, but keep it short: ${selectedText}`,
        specialist: `Explain this to me as if I were a specialist of this field: ${selectedText}`,
        explain: `Explain this to me: ${selectedText}`
    };

    const promptText = promptTexts[type] || promptTexts.explain;
    const result = await session.prompt(promptText);
    return result;
}