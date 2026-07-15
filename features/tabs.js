export const responseBody =
    document.getElementById("responseBody");

export const responseHeaders =
    document.getElementById("responseHeaders");

// Request tabs map directly to tab content ids through data-tab.
export function initRequestTabs() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((item) => {
                item.classList.remove("active");
            });

            tabContents.forEach((content) => {
                content.classList.remove("active");
            });

            tab.classList.add("active");

            const tabName = tab.dataset.tab;

            document
                .getElementById(tabName)
                .classList.add("active");
        });
    });
}

// Response tabs toggle visibility instead of changing the response content.
export function initResponseTabs() {
    const responseTabs = document.querySelectorAll(".response-tab");

    responseTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            responseTabs.forEach((item) => {
                item.classList.remove("active");
            });

            responseBody.classList.add("hidden");
            responseHeaders.classList.add("hidden");

            tab.classList.add("active");

            const tabName = tab.dataset.responseTab;

            document
                .getElementById(tabName)
                .classList.remove("hidden");
        });
    });
}
