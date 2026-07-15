export const authTypeSelect = document.getElementById("authType");
const authFields = document.getElementById("authFields");

// Rebuild the auth-specific inputs whenever the selected auth type changes.
export function renderAuthFields() {
    const authType = authTypeSelect.value;

    authFields.innerHTML = "";

    if (authType === "bearer") {
        authFields.innerHTML = `
            <input
                id="bearerToken"
                type="text"
                placeholder="Bearer Token"
            >
        `;
    }

    else if (authType === "basic") {
        authFields.innerHTML = `
            <input
                id="basicUsername"
                type="text"
                placeholder="Username"
            >

            <input
                id="basicPassword"
                type="password"
                placeholder="Password"
            >
        `;
    }

    else if (authType === "apikey") {
        authFields.innerHTML = `
            <input
                id="apiKeyName"
                type="text"
                placeholder="Key"
            >

            <input
                id="apiKeyValue"
                type="text"
                placeholder="Value"
            >
        `;
    }
}

// Save uses optional reads because some auth types do not render extra fields.
export function collectAuth({ optional = false } = {}) {
    const authType = authTypeSelect.value;

    const auth = {
        type: authType
    };

    const readValue = (id) => {
        const input = document.getElementById(id);

        if (optional) {
            return input?.value || "";
        }

        return input.value;
    };

    if (authType === "bearer") {
        auth.token = readValue("bearerToken");
    }

    else if (authType === "basic") {
        auth.username = readValue("basicUsername");
        auth.password = readValue("basicPassword");
    }

    else if (authType === "apikey") {
        auth.key = readValue("apiKeyName");
        auth.value = readValue("apiKeyValue");
    }

    return auth;
}

export function populateAuth(auth = { type: "none" }) {
    authTypeSelect.value = auth.type;

    // Render the correct input fields before filling saved auth values.
    authTypeSelect.dispatchEvent(
        new Event("change")
    );

    if (auth.type === "bearer") {
        document.getElementById("bearerToken").value =
            auth.token || "";
    }

    else if (auth.type === "basic") {
        document.getElementById("basicUsername").value =
            auth.username || "";

        document.getElementById("basicPassword").value =
            auth.password || "";
    }

    else if (auth.type === "apikey") {
        document.getElementById("apiKeyName").value =
            auth.key || "";

        document.getElementById("apiKeyValue").value =
            auth.value || "";
    }
}

export function initAuthFields() {
    authTypeSelect.addEventListener("change", renderAuthFields);
}
