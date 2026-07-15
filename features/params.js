export const paramsContainer =
    document.getElementById("paramsContainer");

export const headersContainer =
    document.getElementById("headersContainer");

// Params and headers use the same key/value row structure.
export function createKeyValueRow(type) {
    const row = document.createElement("div");

    row.classList.add(
        "key-value-row",
        `${type}-row`
    );

    const keyInput = document.createElement("input");

    keyInput.classList.add(`${type}-key`);

    keyInput.placeholder =
        type === "param" ? "Key" : "Header";

    const valueInput = document.createElement("input");

    valueInput.classList.add(`${type}-value`);

    valueInput.placeholder = "Value";

    const removeButton = document.createElement("button");

    removeButton.classList.add("remove-row");

    removeButton.textContent = "×";

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeButton);

    return row;
}

export function readKeyValueRows(type) {
    const values = {};

    document.querySelectorAll(`.${type}-row`).forEach((row) => {
        const key = row.querySelector(`.${type}-key`).value;
        const value = row.querySelector(`.${type}-value`).value;

        if (key) {
            values[key] = value;
        }
    });

    return values;
}

// Used when loading saved requests or history entries into the editor.
export function renderKeyValueRows(container, type, values = {}) {
    container.innerHTML = "";

    Object.entries(values).forEach(([key, value]) => {
        const row = createKeyValueRow(type);

        row.querySelector(`.${type}-key`).value = key;
        row.querySelector(`.${type}-value`).value = value;

        container.appendChild(row);
    });
}

export function renderEmptyKeyValueRow(container, type) {
    container.innerHTML = "";
    container.appendChild(createKeyValueRow(type));
}

export function initParamsAndHeaders() {
    const addParamBtn = document.getElementById("addParamBtn");
    const addHeaderBtn = document.getElementById("addHeaderBtn");

    addParamBtn.addEventListener("click", () => {
        paramsContainer.appendChild(createKeyValueRow("param"));
    });

    addHeaderBtn.addEventListener("click", () => {
        headersContainer.appendChild(createKeyValueRow("header"));
    });

    // One delegated listener handles remove buttons for both params and headers.
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-row")) {
            event.target
                .closest(".key-value-row")
                .remove();
        }
    });
}
