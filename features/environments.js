import { appState } from "./state.js";

const environmentSelect =
    document.getElementById("environmentSelect");

const manageEnvironmentBtn =
    document.getElementById("manageEnvironment");
const environmentModal =
    document.getElementById("environmentModal");

const closeEnvironmentModal =
    document.getElementById("closeEnvironmentModal");

const environmentNameInput =
    document.getElementById("environmentName");

const environmentVariables =
    document.getElementById("environmentVariables");

const addEnvironmentVariableBtn =
    document.getElementById("addEnvironmentVariable");

const saveEnvironmentBtn =
    document.getElementById("saveEnvironment");
const deleteEnvironmentBtn =
    document.getElementById("deleteEnvironment");

// Keep the persisted environment format exactly as the app already uses it.
function saveEnvironments() {
    localStorage.setItem(
        "sendrEnvironments",
        JSON.stringify(appState.environments)
    );
}

function renderEnvironments() {
    environmentSelect.innerHTML = `
        <option value="">
            No Environment
        </option>
    `;

    Object.keys(appState.environments).forEach((name) => {
        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        environmentSelect.appendChild(option);
    });
}

function createEnvironmentVariableRow(key = "", value = "") {
    const row = document.createElement("div");

    row.classList.add("environment-variable-row");

    const keyInput = document.createElement("input");

    keyInput.classList.add("environment-key");
    keyInput.placeholder = "Variable";
    keyInput.value = key;

    const valueInput = document.createElement("input");

    valueInput.classList.add("environment-value");
    valueInput.placeholder = "Value";
    valueInput.value = value;

    const removeButton = document.createElement("button");

    removeButton.classList.add(
        "remove-environment-variable"
    );

    removeButton.textContent = "×";

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeButton);

    return row;
}

// Supports {{variableName}} placeholders in URL, params, headers, auth, and body.
export function resolveEnvironmentVariables(value) {
    const selectedEnvironment =
        environmentSelect.value;

    if (!selectedEnvironment) {
        return value;
    }

    const variables =
        appState.environments[selectedEnvironment] || {};
console.log("ENV VARIABLES:", variables);
    return value.replace(
        /\{\{([^}]+)\}\}/g,
        (match, variableName) => {
            const key = variableName.trim();

            if (variables[key] !== undefined) {
                return variables[key];
            }

            return match;
        }
    );
}

export function resolveObjectVariables(object) {
    const resolvedObject = {};

    Object.entries(object).forEach(([key, value]) => {
        const resolvedKey =
            resolveEnvironmentVariables(key);

        const resolvedValue =
            resolveEnvironmentVariables(value);

        resolvedObject[resolvedKey] = resolvedValue;
    });

    return resolvedObject;
}

export function initEnvironments() {
    manageEnvironmentBtn.addEventListener("click", () => {
        environmentModal.classList.remove("hidden");

        environmentVariables.innerHTML = "";

        const selectedEnvironment =
            environmentSelect.value;

        if (selectedEnvironment) {
            environmentNameInput.value =
                selectedEnvironment;

            const variables =
                appState.environments[selectedEnvironment];

            Object.entries(variables).forEach(
                ([key, value]) => {
                    environmentVariables.appendChild(
                        createEnvironmentVariableRow(
                            key,
                            value
                        )
                    );
                }
            );
        }

        else {
            environmentNameInput.value = "";

            environmentVariables.appendChild(
                createEnvironmentVariableRow()
            );
        }
    });

    closeEnvironmentModal.addEventListener("click", () => {
        environmentModal.classList.add("hidden");
    });

    addEnvironmentVariableBtn.addEventListener("click", () => {
        environmentVariables.appendChild(
            createEnvironmentVariableRow()
        );
    });

    // Variables are edited as rows inside the modal, so delegation keeps it simple.
    environmentVariables.addEventListener("click", (event) => {
        if (
            event.target.classList.contains(
                "remove-environment-variable"
            )
        ) {
            event.target
                .closest(".environment-variable-row")
                .remove();
        }
    });

    saveEnvironmentBtn.addEventListener("click", () => {
        const environmentName =
            environmentNameInput.value.trim();

        if (!environmentName) {
            return;
        }

        const variables = {};

        environmentVariables
            .querySelectorAll(".environment-variable-row")
            .forEach((row) => {
                const key = row
                    .querySelector(".environment-key")
                    .value
                    .trim();

                const value = row
                    .querySelector(".environment-value")
                    .value;

                if (key) {
                    variables[key] = value;
                }
            });

        appState.environments[environmentName] = variables;

        saveEnvironments();
        renderEnvironments();

        environmentSelect.value =
            environmentName;

        environmentModal.classList.add("hidden");
    });

    deleteEnvironmentBtn.addEventListener("click", () => {
        const selectedEnvironment =
            environmentSelect.value;

        if (!selectedEnvironment) {
            return;
        }

        const shouldDelete = confirm(
            `Delete environment "${selectedEnvironment}"?`
        );

        if (!shouldDelete) {
            return;
        }

        delete appState.environments[selectedEnvironment];

        saveEnvironments();
        renderEnvironments();

        environmentSelect.value = "";
        environmentModal.classList.add("hidden");
    });

    renderEnvironments();
}
