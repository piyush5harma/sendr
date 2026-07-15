import {
    headersContainer,
    paramsContainer,
    readKeyValueRows,
    renderEmptyKeyValueRow,
    renderKeyValueRows
} from "./params.js";
import {
    collectAuth,
    populateAuth
} from "./auth.js";
import {
    responseBody,
    responseHeaders
} from "./tabs.js";

// Single source for building a request object from the current editor state.
export function collectRequestFromEditor({ optionalAuth = false } = {}) {
    return {
        method: document.getElementById("method").value,
        url: document.getElementById("url").value,
        params: readKeyValueRows("param"),
        headers: readKeyValueRows("header"),
        auth: collectAuth({ optional: optionalAuth }),
        body: document.getElementById("requestBody").value
    };
}

// Shared by saved requests and history so both load requests identically.
export function loadRequestIntoEditor(request, title) {
    document.getElementById("method").value =
        request.method;

    document.getElementById("url").value =
        request.url;

    renderKeyValueRows(
        paramsContainer,
        "param",
        request.params || {}
    );

    renderKeyValueRows(
        headersContainer,
        "header",
        request.headers || {}
    );

    populateAuth(request.auth || {
        type: "none"
    });

    document.getElementById("requestBody").value =
        request.body || "";

    document.querySelector("header h2").textContent =
        title;
}

// Restores the editor to the same default state used by a new request.
export function resetRequestEditor() {
    document.getElementById("method").value = "GET";
    document.getElementById("url").value = "";

    renderEmptyKeyValueRow(paramsContainer, "param");
    renderEmptyKeyValueRow(headersContainer, "header");

    populateAuth({
        type: "none"
    });

    document.getElementById("requestBody").value = "";

    document.querySelector("header h2").textContent =
        "Untitled Request";

    responseBody.textContent =
        "Send a request to see the response";

    responseHeaders.textContent = "";

    document.getElementById("status").textContent =
        "Status: --";

    document.getElementById("time").textContent =
        "Time: --";

    document.getElementById("size").textContent =
        "Size: --";
}
