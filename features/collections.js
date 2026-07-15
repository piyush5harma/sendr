import { appState } from "./state.js";
import { collectRequestFromEditor } from "./requestLoader.js";

const saveBtn = document.getElementById("saveBtn");

const collectionsContainer =
    document.getElementById("collectionsContainer");

// Preserve the existing collection storage key and data shape.
function saveCollections() {
    localStorage.setItem(
        "sendrCollections",
        JSON.stringify(appState.collections)
    );
}

// Re-rendering keeps dataset indexes aligned after saves, deletes, and renames.
function renderCollections() {
    collectionsContainer.innerHTML = "";

    const collectionNames = Object.keys(appState.collections);

    if (collectionNames.length === 0) {
        collectionsContainer.innerHTML = `
            <div class="empty-message">
                No collections yet
            </div>
        `;

        return;
    }

    collectionNames.forEach((collectionName) => {
        const collection = document.createElement("div");

        collection.classList.add("collection");

        const title = document.createElement("div");

        title.classList.add("collection-title");
        title.textContent = collectionName;
        title.dataset.collection = collectionName;

        const deleteCollectionBtn =
            document.createElement("button");

        deleteCollectionBtn.classList.add(
            "delete-collection"
        );

        deleteCollectionBtn.innerHTML = "&times;";

        title.appendChild(deleteCollectionBtn);
        collection.appendChild(title);

        appState.collections[collectionName].forEach(
            (request, index) => {
                const requestItem =
                    document.createElement("div");

                requestItem.classList.add("saved-request");

                const methodBadge =
                    document.createElement("span");

                methodBadge.classList.add(
                    "method-badge",
                    `method-${request.method.toLowerCase()}`
                );

                methodBadge.textContent = request.method;

                const requestName =
                    document.createElement("span");

                requestName.classList.add("request-name");
                requestName.textContent = request.name;

                requestItem.appendChild(methodBadge);
                requestItem.appendChild(requestName);

                const deleteRequestBtn =
                    document.createElement("button");

                deleteRequestBtn.classList.add("delete-request");
                deleteRequestBtn.innerHTML = "&times;";

                requestItem.appendChild(deleteRequestBtn);

                requestItem.dataset.collection = collectionName;
                requestItem.dataset.index = index;

                collection.appendChild(requestItem);
            }
        );

        collectionsContainer.appendChild(collection);
    });
}

export function clearActiveRequest() {
    appState.activeRequest = null;
}

export function initCollections({ loadRequest }) {
    renderCollections();

    // Save updates the active saved request, or creates a new collection entry.
    saveBtn.addEventListener("click", () => {
        const request = collectRequestFromEditor({
            optionalAuth: true
        });

        if (appState.activeRequest) {
            const {
                collectionName,
                requestIndex
            } = appState.activeRequest;

            request.name =
                appState.collections[collectionName][requestIndex].name;

            appState.collections[collectionName][requestIndex] =
                request;
        }

        else {
            const requestName = prompt("Request name:");

            if (!requestName) {
                return;
            }

            const collectionName = prompt("Collection name:");

            if (!collectionName) {
                return;
            }

            request.name = requestName;

            if (!appState.collections[collectionName]) {
                appState.collections[collectionName] = [];
            }

            appState.collections[collectionName].push(request);

            appState.activeRequest = {
                collectionName: collectionName,
                requestIndex:
                    appState.collections[collectionName].length - 1
            };
        }

        saveCollections();
        renderCollections();
    });

    // Request delete is delegated because saved request rows are rebuilt often.
    collectionsContainer.addEventListener("click", (event) => {
        const deleteButton =
            event.target.closest(".delete-request");

        if (!deleteButton) {
            return;
        }

        event.stopPropagation();

        const requestItem =
            deleteButton.closest(".saved-request");

        const collectionName =
            requestItem.dataset.collection;

        const requestIndex =
            Number(requestItem.dataset.index);

        const shouldDelete = confirm(
            "Delete this request?"
        );

        if (!shouldDelete) {
            return;
        }

        if (
            appState.activeRequest &&
            appState.activeRequest.collectionName === collectionName
        ) {
            if (appState.activeRequest.requestIndex === requestIndex) {
                appState.activeRequest = null;

                document.querySelector("header h2").textContent =
                    "Untitled Request";
            }

            else if (appState.activeRequest.requestIndex > requestIndex) {
                appState.activeRequest.requestIndex--;
            }
        }

        appState.collections[collectionName].splice(
            requestIndex,
            1
        );

        if (appState.collections[collectionName].length === 0) {
            delete appState.collections[collectionName];
        }

        saveCollections();
        renderCollections();
    });

    // Double-clicking a request name renames only that saved request.
    collectionsContainer.addEventListener("dblclick", (event) => {
        const requestName =
            event.target.closest(".request-name");

        if (!requestName) {
            return;
        }

        const requestItem =
            requestName.closest(".saved-request");

        const collectionName =
            requestItem.dataset.collection;

        const requestIndex =
            Number(requestItem.dataset.index);

        const currentName =
            appState.collections[collectionName][requestIndex].name;

        const newName = prompt(
            "Rename request:",
            currentName
        );

        if (!newName || newName.trim() === "") {
            return;
        }

        appState.collections[collectionName][requestIndex].name =
            newName.trim();

        if (
            appState.activeRequest &&
            appState.activeRequest.collectionName === collectionName &&
            appState.activeRequest.requestIndex === requestIndex
        ) {
            document.querySelector("header h2").textContent =
                newName.trim();
        }

        saveCollections();
        renderCollections();
    });

    // Collection rename keeps the active request pointed at the renamed group.
    collectionsContainer.addEventListener("dblclick", (event) => {
        const collectionTitle =
            event.target.closest(".collection-title");

        if (!collectionTitle) {
            return;
        }

        const oldName =
            collectionTitle.dataset.collection;

        const newName = prompt(
            "Rename collection:",
            oldName
        );

        if (!newName || newName.trim() === "") {
            return;
        }

        const trimmedName = newName.trim();

        if (
            trimmedName !== oldName &&
            appState.collections[trimmedName]
        ) {
            alert("Collection already exists");
            return;
        }

        appState.collections[trimmedName] =
            appState.collections[oldName];

        if (trimmedName !== oldName) {
            delete appState.collections[oldName];
        }

        if (
            appState.activeRequest &&
            appState.activeRequest.collectionName === oldName
        ) {
            appState.activeRequest.collectionName = trimmedName;
        }

        saveCollections();
        renderCollections();
    });

    // Collection delete removes the group and clears the active edit state if needed.
    collectionsContainer.addEventListener("click", (event) => {
        const deleteButton =
            event.target.closest(".delete-collection");

        if (!deleteButton) {
            return;
        }

        event.stopPropagation();

        const collectionTitle =
            deleteButton.closest(".collection-title");

        const collectionName =
            collectionTitle.dataset.collection;

        const shouldDelete = confirm(
            `Delete collection "${collectionName}" and all its requests?`
        );

        if (!shouldDelete) {
            return;
        }

        if (
            appState.activeRequest &&
            appState.activeRequest.collectionName === collectionName
        ) {
            appState.activeRequest = null;

            document.querySelector("header h2").textContent =
                "Untitled Request";
        }

        delete appState.collections[collectionName];

        saveCollections();
        renderCollections();
    });

    // Normal row clicks load the saved request into the shared editor.
    collectionsContainer.addEventListener("click", (event) => {
        const requestItem =
            event.target.closest(".saved-request");

        if (!requestItem) {
            return;
        }

        const collectionName = requestItem.dataset.collection;
        const requestIndex = requestItem.dataset.index;

        const request =
            appState.collections[collectionName][requestIndex];

        appState.activeRequest = {
            collectionName: collectionName,
            requestIndex: Number(requestIndex)
        };

        loadRequest(request, request.name);
    });
}
