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
                    "default{text-align:center}" +
                    "observed{text-align:right}"
            }),
            // ------------------------------------------------------------ create <attribute-titles>
            ...[
                "attributes &nbsp;&nbsp;",
                "&lt;" + (this.getAttribute("component") || `set attribute component="name"`) + "&gt;",
                "default",
                "observed"
            ].map(title => createElement("attribute-title", { innerHTML: title + "&nbsp;" })),
            // ------------------------------------------------------------ create attribute lines
            ...lines(this.innerHTML).map(line => {
                const [attrname, innerHTML, defaultValue = "", observed = false] = line.split(':').map(part => part.trim());
                return [
                    createElement("attributes", { className: "name", innerHTML: attrname }),
                    createElement("description", { innerHTML }),
                    createElement("default", { innerHTML: defaultValue }),
                    createElement("observed", { innerHTML: observed })
                ];
            }).flat()
            // ------------------------------------------------------------
        )// append
    }// render
});// customElements.define
// ************************************************************************