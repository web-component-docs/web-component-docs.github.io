// helper functions
// ========================================================================
const createElement = (tag, props = {}) => Object.assign(document.createElement(tag), props);
// ======================================================================== lines
const lines = (str, separator = "\n") =>
    str.trim() // trim whitespace
        .split(separator) // split into lines
        .map(line => line.trim()) // trim whitespace from each line
        .filter(Boolean); // remove empty lines

// ************************************************************************ <web-component-attributes>
customElements.define('web-component-attributes', class extends HTMLElement {
    // ==================================================================== connectedCallback()
    connectedCallback() {
        setTimeout(() => this.render());
    }
    // ==================================================================== render()
    render() {
        this.attachShadow({
            mode: "open"
        }).append(
            // ------------------------------------------------------------ create <style>
            createElement("style", {
                innerHTML:
                    ":host{display:grid;grid:auto/fit-content(8em) fit-content(16em) fit-content(4em) fit-content(2em);font-family:sans-serif}" +
                    "attribute-title{font-weight:bold;font-size:1.2em}" +
                    "*:not(empty){padding:0.2em;border-bottom:1px solid darkgrey}" +
                    "default,observed{text-align:center}"
            }),
            // ------------------------------------------------------------ create <attribute-titles>
            ...[
                "attributes &nbsp;&nbsp;",
                "&lt;" + (this.getAttribute("component") || 'set attribute component="name"') + "&gt;",
                "default",
                "observed"
            ].map(title => createElement("attribute-title", { innerHTML: title + "&nbsp;" })),
            // ------------------------------------------------------------ create attribute lines
            ...lines(this.innerHTML).map(line => {
                const [attrname, innerHTML, defaultValue = "", observed = false] = line.split('|').map(part => part.trim());
                return [
                    createElement("attributes", { className: "name", innerHTML: attrname }),
                    createElement("description", { innerHTML }),
                    createElement("default", { innerHTML: defaultValue }),
                    createElement("observed", { innerHTML: observed ? "yes" : "" })
                ];
            }).flat()
            // ------------------------------------------------------------
        )// append
    }// render
});// customElements.define
// ************************************************************************ <copy-paste-button>
customElements.define('copy-paste-button', class extends HTMLElement {
    constructor() {
        super().attachShadow({
            mode: "open"
        }).innerHTML =
            '<svg part="svg" viewBox="0 0 48 48" style="width:1.2em;cursor:copy;background:teal">' +
            '<path d="m1 20c0-3 2-5 5-5h4a2 2 90 010 4h-4a1 1 90 00-1 1v19c0 1 1 1 1 1h19a1 1 90 001-1v-4a2 2 90 014 0v4a5 5 90 01-5 5h-19a5 5 90 01-5-5zm13-13c0-3 2-5 5-5h19c3 0 5 2 5 5v19a5 5 90 01-5 5h-19a5 5 90 01-5-5zm5-1a1 1 90 00-1 1v19c0 1 1 1 1 1h19a1 1 90 001-1v-19a1 1 90 00-1-1z"/></svg>';
        this.onclick = async () => {
            this.text = (
                this.getAttribute("selector") ? document.querySelector(this.getAttribute("selector")) : this
            ).textContent.trim();
            await navigator.clipboard.writeText(this.text);
            this.dispatchEvent(new Event(this.localName, { bubbles: 1 }));
        }
    }
});
