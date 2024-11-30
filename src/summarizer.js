/**
 * Summarizes the given text using Geminin Nano Summarizer.
 *
 * @param {string} text - The text to be summarized.
 * @param {string} [type='key-points'] - The type of summary to generate. Default is 'key-points'.
 * @param {string} [length='short'] - The length of the summary. Default is 'short'.
 * @returns {Promise<string>} - A promise that resolves to the summary of the text.
 * @throws {Error} - Throws an error if the summarizer is not available.
 */
export async function summarizeText(text, type = 'key-points', length = 'short') {
    // Check the capabilities of the summarizer
    const canSummarize = await ai.summarizer.capabilities();
    let summarizer;

    // If summarizer is available, create a summarizer instance
    if (canSummarize.available !== 'no') {
        if (canSummarize.available === 'readily') {
            summarizer = await ai.summarizer.create({ type, length });
        } else {
            summarizer = await ai.summarizer.create({ type, length });
            // Wait until the summarizer is readily available
            while ((await ai.summarizer.capabilities()).available !== 'readily') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before rechecking
            }
        }

        // Generate the summary
        const summary = await summarizer.summarize(text);

        // If the summary type is 'key-points' and the summary is an array, format it as a bullet point list
        if (type === 'key-points' && Array.isArray(summary)) {
            const listItems = summary.map(point => `<li>${point}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        } else {
            return summary; // Return the summary as is for other types
        }

    } else {
        throw new Error('Summarizer is not available.');
    }
}