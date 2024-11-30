/**
 * Creates a writer instance with the specified options.
 *
 * @param {Object} options - The options for creating the writer.
 * @param {string} options.tone - The tone of the writer.
 * @param {number} options.length - The length of the content to be generated.
 * @param {Object} options.sharedContext - The shared context for the writer.
 * @returns {Promise<Object>} The created writer instance.
 * @throws {Error} If the writer cannot be created.
 */
export async function createWriter(options) {
    try {
        const writer = await ai.writer.create({
            tone: options.tone,
            length: options.length,
            format: 'markdown',
            sharedContext: options.sharedContext
        });
        await writer.ready;
        return writer;
    } catch (error) {
        console.error('Error creating writer:', error);
        throw new Error('Writer is not available.');
    }
}

/**
 * Creates a rewriter instance with the specified options.
 *
 * @param {Object} options - The options for creating the rewriter.
 * @param {string} options.tone - The tone of the rewriter.
 * @param {number} options.length - The length of the content to be generated.
 * @param {Object} options.sharedContext - The shared context for the rewriter.
 * @returns {Promise<Object>} The created rewriter instance.
 * @throws {Error} If the rewriter cannot be created.
 */
export async function createRewriter(options) {
    try {
        const rewriter = await ai.rewriter.create({
            tone: options.tone,
            length: options.length,
            format: 'markdown',
            sharedContext: options.sharedContext
        });
        await rewriter.ready;
        return rewriter;
    } catch (error) {
        console.error('Error creating rewriter:', error);
        throw new Error('Rewriter is not available.');
    }
}