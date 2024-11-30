/**
 * Adds a click event listener to a toggle element that toggles the visibility of a container element.
 * @param {string} toggleId - The ID of the toggle element.
 * @param {string} containerId - The ID of the container element.
 */
function addToggleEvent(toggleId, containerId) {
    const toggle = document.getElementById(toggleId);
    const container = document.getElementById(containerId);

    toggle.addEventListener('click', () => {
        container.classList.toggle('show');
    });
}

// Add toggle event listeners for settings and writer settings containers
addToggleEvent('toggleSettings', 'settingsContainer');
addToggleEvent('toggleWriterSettings', 'writerSettingsContainer');