import { appState } from "./state.js";
import { clearActiveRequest } from "./collections.js";

const historyContainer =
    document.getElementById("historyContainer");

// Preserve the existing history storage key and array format.
function saveHistory() {
    localStorage.setItem(
        "sendrHistory",
        JSON.stringify(appState.requestHistory)
    );
}

export function renderHistory() {
    historyContainer.innerHTML = "";

    if (appState.requestHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-message">
                No request history
            </div>
        `;

        return;
    }

    appState.requestHistory.forEach((request, index) => {
        const historyItem =
            document.createElement("div");

        historyItem.classList.add("history-item");
        historyItem.dataset.index = index;

        const methodBadge =
            document.createElement("span");

        methodBadge.classList.add(
            "method-badge",
            `method-${request.method.toLowerCase()}`
        );

        methodBadge.textContent = request.method;

        const historyUrl =
            document.createElement("span");

        historyUrl.classList.add("history-url");
        historyUrl.textContent = request.url;

        historyItem.appendChild(methodBadge);
        historyItem.appendChild(historyUrl);

        historyContainer.appendChild(historyItem);
    });
}

export function addRequestToHistory(requestConfig) {
    appState.requestHistory.unshift({
        method: requestConfig.method,
        url: requestConfig.url,
        params: requestConfig.params,
        headers: requestConfig.headers,
        auth: requestConfig.auth,
        body: requestConfig.body
    });

    // Keep history bounded so localStorage usage stays predictable.
    if (appState.requestHistory.length > 50) {
        appState.requestHistory.pop();
    }

    saveHistory();
    renderHistory();
}

export function initHistory({ loadRequest }) {
    renderHistory();

    historyContainer.addEventListener("click", (event) => {
        const historyItem =
            event.target.closest(".history-item");

        if (!historyItem) {
            return;
        }

        const historyIndex =
            Number(historyItem.dataset.index);

        const request =
            appState.requestHistory[historyIndex];

        // History entries are snapshots, not saved requests being edited.
        clearActiveRequest();
        loadRequest(request, "History Request");
    });
}
