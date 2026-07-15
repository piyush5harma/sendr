import { collectAuth } from "./auth.js";
import {
    resolveEnvironmentVariables,
    resolveObjectVariables
} from "./environments.js";
import { readKeyValueRows } from "./params.js";
import {
    responseBody,
    responseHeaders
} from "./tabs.js";
import { addRequestToHistory } from "./history.js";

const sendBtn = document.getElementById("sendBtn");

export function initSendRequest() {
    sendBtn.addEventListener("click", () => {
        const method = document.getElementById("method").value;

        const rawUrl =
            document.getElementById("url").value;

        if (!rawUrl.trim()) {
            alert("Please enter a request URL");
            return;
        }
        // Resolve placeholders only in the final request sent to the backend.
        const url =
            resolveEnvironmentVariables(rawUrl);

            console.log("RAW URL:", rawUrl);
console.log("RESOLVED URL:", url);
console.log("SELECTED ENV:", document.getElementById("environmentSelect").value);
        // Validate the raw URL before environment replacement to preserve current behavior.
        try {
            new URL(url);
        } catch {
            alert("Please enter a valid URL");
            return;
        }



        const params = readKeyValueRows("param");
        const headers = readKeyValueRows("header");

        const resolvedParams =
            resolveObjectVariables(params);

        const resolvedHeaders =
            resolveObjectVariables(headers);

        const auth = collectAuth();

        // Auth values can also contain environment placeholders.
        Object.keys(auth).forEach((key) => {
            if (typeof auth[key] === "string") {
                auth[key] =
                    resolveEnvironmentVariables(auth[key]);
            }
        });

        const body = document.getElementById("requestBody").value;

        const contentType =
            resolvedHeaders["Content-Type"] ||
            resolvedHeaders["content-type"] ||
            "";

        // Only validate JSON when the request declares a JSON content type.
        if (
            body.trim() &&
            contentType.includes("application/json")
        ) {
            try {
                JSON.parse(body);
            }
            catch {
                alert("Request body contains invalid JSON");
                return;
            }
        }

        const requestConfig = {
            method: method,
            url: url,
            params: resolvedParams,
            headers: resolvedHeaders,
            auth: auth,
            body: resolveEnvironmentVariables(body)
        };

        // History stores the resolved request snapshot that was actually sent.
        addRequestToHistory(requestConfig);

        responseBody.textContent = "Sending request...";

        document.getElementById("status").textContent =
            "Status: --";

        document.getElementById("time").textContent =
            "Time: --";

        document.getElementById("size").textContent =
            "Size: --";

        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";

        // All outbound calls continue to go through the Sendr backend proxy.
        fetch("http://localhost:8080/api/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestConfig)
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("Backend response:", data);

                if (data.error) {
                    responseBody.textContent = data.error;

                    document.getElementById("status").textContent =
                        "Status: Error";

                    document.getElementById("time").textContent =
                        "Time: --";

                    document.getElementById("size").textContent =
                        "Size: --";

                    return;
                }

                document.getElementById("status").textContent =
                    `Status: ${data.status} ${data.statusText}`;

                document.getElementById("time").textContent =
                    `Time: ${data.time}ms`;

                document.getElementById("size").textContent =
                    `Size: ${data.size} bytes`;

                let formattedBody = data.body;

                try {
                    const json = JSON.parse(data.body);

                    formattedBody = JSON.stringify(json, null, 2);
                } catch {
                    // Response is not JSON
                }

                responseBody.textContent = formattedBody;

                responseHeaders.textContent =
                    JSON.stringify(data.headers, null, 2);
            })
            .catch((error) => {
                console.error("Error:", error);

                responseBody.textContent =
                    `Request failed: ${error.message}`;

                document.getElementById("status").textContent =
                    "Status: Error";

                document.getElementById("time").textContent =
                    "Time: --";

                document.getElementById("size").textContent =
                    "Size: --";
            })
            .finally(() => {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send";
            });
    });
}
