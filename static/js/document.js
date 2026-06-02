const DocumentsApp = (() => {
    'use strict';

    const CONFIG = {
        API_BASE: `/api/v1`,
        SELECTORS: {
            CHARTER_CONTAINER: '#charter-container',
            MEETINGS_CONTAINER: '#meetings-container',
            MEETINGS_LIST: '#meetings-list-dynamic',
            MEETINGS_TOGGLE: '#meetings-toggle'
        },
        CLASSES: {
            MEETINGS_HIDDEN: 'meetings-item--hidden',
            EXPANDED: 'expanded',
            ACTIVE: 'active'
        },
        LIMITS: {
            MEETINGS_VISIBLE: 10
        },
        TIMEOUT_MS: 10000
    };

    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            loadCharter();
            loadMeetings();
        });
    }

    async function fetchJson(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (e) {
            clearTimeout(timeoutId);
            if (e.name !== 'AbortError') console.warn(`Fetch failed: ${url}`, e);
            return null;
        }
    }

    function buildFileLink(folder, fileName) {
        const name = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        return `${CONFIG.API_BASE}/folder/${folder}/get?attachment=${encodeURIComponent(name)}`;
    }

    function getDisplayName(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    }

    function renderDocItem(text, href) {
        return `<div class="doc-item"><a class="doc-item__link" href="${href}" target="_blank">${text}</a></div>`;
    }

    function renderMeetingItem(text, href, hidden = false) {
        const hiddenClass = hidden ? ` ${CONFIG.CLASSES.MEETINGS_HIDDEN}` : '';
        return `<li class="meetings-item${hiddenClass}"><a class="meetings-list__link" href="${href}" target="_blank">${text}</a></li>`;
    }

    async function loadCharter() {
        const container = document.querySelector(CONFIG.SELECTORS.CHARTER_CONTAINER);
        if (!container) return;
        const files = await fetchJson(`${CONFIG.API_BASE}/folder/устав/list`);
        if (files?.length > 0) {
            container.innerHTML = files.map(f => renderDocItem(getDisplayName(f.name), buildFileLink('устав', f.name))).join('');
        } else {
            container.innerHTML = '<div class="empty-message">Нет доступных документов</div>';
        }
    }

    async function loadMeetings() {
        const container = document.querySelector(CONFIG.SELECTORS.MEETINGS_CONTAINER);
        const toggleBtn = document.querySelector(CONFIG.SELECTORS.MEETINGS_TOGGLE);
        if (!container) return;
        const files = await fetchJson(`${CONFIG.API_BASE}/folder/совещания/list`);
        if (files?.length > 0) {
            const itemsHtml = files.map((f, i) => 
                renderMeetingItem(getDisplayName(f.name), buildFileLink('совещания', f.name), i >= CONFIG.LIMITS.MEETINGS_VISIBLE)
            ).join('');
            container.innerHTML = `<ul class="meetings-list" id="meetings-list-dynamic">${itemsHtml}</ul>`;
            
            const shouldShowToggle = files.length > CONFIG.LIMITS.MEETINGS_VISIBLE;
            if (toggleBtn) {
                toggleBtn.style.display = shouldShowToggle ? 'flex' : 'none';
                if (shouldShowToggle) {
                    toggleBtn.classList.remove(CONFIG.CLASSES.ACTIVE);
                    const textEl = toggleBtn.querySelector('.doc-section__toggle-text');
                    if (textEl) textEl.textContent = 'см. больше';
                }
            }
            
            initMeetingsToggle();
        } else {
            container.innerHTML = '<div class="empty-message">Нет доступных материалов</div>';
            if (toggleBtn) toggleBtn.style.display = 'none';
        }
    }

    function initMeetingsToggle() {
        const toggleBtn = document.querySelector(CONFIG.SELECTORS.MEETINGS_TOGGLE);
        const meetingsList = document.querySelector(CONFIG.SELECTORS.MEETINGS_LIST);
        
        if (!toggleBtn || !meetingsList) return;
        
        const hiddenItems = meetingsList.querySelectorAll(`.${CONFIG.CLASSES.MEETINGS_HIDDEN}`);
        if (hiddenItems.length === 0) {
            toggleBtn.style.display = 'none';
            return;
        }
        
        if (toggleBtn.style.display !== 'flex') {
            toggleBtn.style.display = 'flex';
        }
        
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        
        const clickHandler = () => {
            meetingsList.classList.toggle(CONFIG.CLASSES.EXPANDED);
            newToggleBtn.classList.toggle(CONFIG.CLASSES.ACTIVE);
            const textEl = newToggleBtn.querySelector('.doc-section__toggle-text');
            if (textEl) {
                textEl.textContent = newToggleBtn.classList.contains(CONFIG.CLASSES.ACTIVE) ? 'см. меньше' : 'см. больше';
            }
        };
        
        newToggleBtn.addEventListener('click', clickHandler);
    }

    return { init };
})();

DocumentsApp.init();
