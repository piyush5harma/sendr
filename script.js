import {
    initRequestTabs,
    initResponseTabs
} from "./features/tabs.js";
import { initParamsAndHeaders } from "./features/params.js";
import { initAuthFields } from "./features/auth.js";
import { initEnvironments } from "./features/environments.js";
import {
    clearActiveRequest,
    initCollections
} from "./features/collections.js";
import { initHistory } from "./features/history.js";
import {
    loadRequestIntoEditor,
    resetRequestEditor
} from "./features/requestLoader.js";
import { initSendRequest } from "./features/sendRequest.js";

// App entry point: each feature owns its own DOM listeners.
initRequestTabs();
initResponseTabs();
initParamsAndHeaders();
initAuthFields();
initEnvironments();

// Saved requests and history both reuse the same editor-loading path.
initCollections({
    loadRequest: loadRequestIntoEditor
});

initHistory({
    loadRequest: loadRequestIntoEditor
});

initSendRequest();

// Starting fresh also clears the saved-request editing context.
document
    .getElementById("newRequestBtn")
    .addEventListener("click", () => {
        clearActiveRequest();
        resetRequestEditor();
    });
