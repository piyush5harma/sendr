const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8080;

const allowedMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
];

app.use(cors());

app.use(express.json({
    limit: "1mb"
}));


function validateTargetUrl(url) {

    let targetUrl;

    try {
        targetUrl = new URL(url);
    } catch {
        throw new Error("Invalid URL");
    }

    if (
        targetUrl.protocol !== "http:" &&
        targetUrl.protocol !== "https:"
    ) {
        throw new Error(
            "Only HTTP and HTTPS URLs are allowed"
        );
    }

    return targetUrl;
}


app.post("/api/request", async (req, res) => {

    try {

const {
    method,
    url,
    params = {},
    headers = {},
    auth = {
        type: "none"
    },
    body = ""
} = req.body;

        // VALIDATE METHOD

        if (!method) {
            return res.status(400).json({
                error: "HTTP method is required"
            });
        }

        const normalizedMethod = method.toUpperCase();

        if (!allowedMethods.includes(normalizedMethod)) {
            return res.status(400).json({
                error: "Unsupported HTTP method"
            });
        }


        // VALIDATE URL

        if (!url) {
            return res.status(400).json({
                error: "Request URL is required"
            });
        }

        const targetUrl = validateTargetUrl(url);


        // ADD QUERY PARAMETERS

        Object.entries(params).forEach(([key, value]) => {
            targetUrl.searchParams.append(key, value);
        });
// APPLY AUTHENTICATION

if (auth.type === "bearer" && auth.token) {

    headers["Authorization"] =
        `Bearer ${auth.token}`;

}


else if (
    auth.type === "basic" &&
    auth.username
) {

    const credentials = Buffer
        .from(
            `${auth.username}:${auth.password || ""}`
        )
        .toString("base64");

    headers["Authorization"] =
        `Basic ${credentials}`;

}


else if (
    auth.type === "apikey" &&
    auth.key
) {

    headers[auth.key] = auth.value;

}

        // AUTO-DETECT CONTENT-TYPE (like Postman)
        // If the user provided a body but no Content-Type header,
        // auto-set it based on whether the body looks like valid JSON.

        if (
            normalizedMethod !== "GET" &&
            body &&
            !headers["Content-Type"] &&
            !headers["content-type"]
        ) {
            try {
                JSON.parse(body);
                headers["Content-Type"] = "application/json";
            } catch {
                // Not valid JSON, default to text/plain
                headers["Content-Type"] = "text/plain";
            }
        }


        // BUILD TARGET REQUEST

        const fetchConfig = {
            method: normalizedMethod,
            headers: headers,
            signal: AbortSignal.timeout(10000)
        };


        // ADD BODY

        if (
            normalizedMethod !== "GET" &&
            body
        ) {
            fetchConfig.body = body;
        }


        // SEND REQUEST

        const startTime = performance.now();
        
        const response = await fetch(
            targetUrl.toString(),
            fetchConfig
        );

        const responseBody = await response.text();

        const endTime = performance.now();


        // RESPONSE SIZE

        const responseSize = Buffer.byteLength(
            responseBody,
            "utf8"
        );


        // SEND RESULT TO FRONTEND

        res.json({
            status: response.status,
            statusText: response.statusText,

            headers: Object.fromEntries(
                response.headers.entries()
            ),

            body: responseBody,

            time: Math.round(endTime - startTime),

            size: responseSize
        });

    } catch (error) {

        console.error(
            "Request failed:",
            error.message
        );

        if (
            error.name === "TimeoutError" ||
            error.name === "AbortError"
        ) {
            return res.status(408).json({
                error: "Target API request timed out"
            });
        }

        res.status(500).json({
            error: error.message || "Request failed"
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Sendr server running on port ${PORT}`
    );

});