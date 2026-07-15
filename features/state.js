// Central shared state, hydrated from the existing localStorage keys.
export const appState = {
    collections:
        JSON.parse(localStorage.getItem("sendrCollections")) || {},
    activeRequest: null,
    requestHistory:
        JSON.parse(localStorage.getItem("sendrHistory")) || [],
    environments:
        JSON.parse(localStorage.getItem("sendrEnvironments")) || {}
};
