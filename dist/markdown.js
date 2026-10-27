import { getDefaults, lexer } from "./vendor/marked.esm.js";

const lexerOptions = { ...getDefaults(), gfm: true, breaks: true };
const schemePattern = /^[a-z][a-z0-9+.-]*:/i;
const allowedSchemes = /^(?:https?:|mailto:)/i;
const spacedTags = new Set([
  "blockquote",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "li",
  "ol",
  "p",
  "pre",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]);

function element(tag, attrs, children) {
  return { tag, attrs, children };
}

function safeUrl(href) {
  const url = (href ?? "").trim();
  if (!url) return null;
  return schemePattern.test(url) && !allowedSchemes.test(url) ? null : url;
}

function tableCell(tag, cell) {
  const attrs = cell.align ? { style: "text-align:" + cell.align } : {};
  return element(tag, attrs, inlineNodes(cell.tokens));
}

const inlineRenderers = {
  escape: (token) => [token.text],
  text: (token) => (token.tokens ? inlineNodes(token.tokens) : [token.text]),
  strong: (token) => [element("strong", {}, inlineNodes(token.tokens))],
  em: (token) => [element("em", {}, inlineNodes(token.tokens))],
  del: (token) => [element("del", {}, inlineNodes(token.tokens))],
  codespan: (token) => [element("code", {}, [token.text])],
  br: () => [element("br", {}, [])],
  html: (token) => [token.text],
  checkbox: (token) => [
    element(
      "input",
      { type: "checkbox", disabled: "", ...(token.checked ? { checked: "" } : {}) },
      [],
    ),
  ],
  link: (token) => {
    const href = safeUrl(token.href);
    if (href === null) return inlineNodes(token.tokens);
    const attrs = { href };
    if (token.title) attrs.title = token.title;
    if (/^https?:/i.test(href)) {
      attrs.target = "_blank";
      attrs.rel = "noopener";
    }
    return [element("a", attrs, inlineNodes(token.tokens))];
  },
  image: (token) => {
    const src = safeUrl(token.href);
    if (src === null) return [token.text];
    const attrs = { src, alt: token.text, loading: "lazy" };
    if (token.title) attrs.title = token.title;
    return [element("img", attrs, [])];
  },
};

const blockRenderers = {
  space: () => [],
  def: () => [],
  hr: () => [element("hr", {}, [])],
  heading: (token) => [
    element("h" + token.depth, {}, inlineNodes(token.tokens)),
  ],
  paragraph: (token) => [element("p", {}, inlineNodes(token.tokens))],
  text: (token) => (token.tokens ? inlineNodes(token.tokens) : [token.text]),
  blockquote: (token) => [
    element("blockquote", {}, blockNodes(token.tokens)),
  ],
  code: (token) => {
    const language = (token.lang ?? "").trim().split(/\s+/)[0];
    const attrs = language ? { class: "language-" + language } : {};
    return [element("pre", {}, [element("code", attrs, [token.text])])];
  },
  list: (token) => {
    const attrs =
      token.ordered && token.start !== 1 ? { start: String(token.start) } : {};
    return [
      element(
        token.ordered ? "ol" : "ul",
        attrs,
        token.items.map((item) => element("li", {}, blockNodes(item.tokens))),
      ),
    ];
  },
  checkbox: inlineRenderers.checkbox,
  table: (token) => [
    element("table", {}, [
      element("thead", {}, [
        element(
          "tr",
          {},
          token.header.map((cell) => tableCell("th", cell)),
        ),
      ]),
      element(
        "tbody",
        {},
        token.rows.map((row) =>
          element(
            "tr",
            {},
            row.map((cell) => tableCell("td", cell)),
          ),
        ),
      ),
    ]),
  ],
  html: (token) => [token.text],
};

function renderTokens(tokens, renderers) {
  return tokens.flatMap((token) => {
    const render = renderers[token.type];
    return render ? render(token) : [token.raw ?? ""];
  });
}

function inlineNodes(tokens) {
  return renderTokens(tokens, inlineRenderers);
}

function blockNodes(tokens) {
  return renderTokens(tokens, blockRenderers);
}

export function markdownTree(source) {
  return blockNodes(lexer(String(source ?? ""), lexerOptions));
}

function collectText(node, out) {
  if (typeof node === "string") {
    out.push(node);
    return;
  }
  if (node.tag === "img") {
    out.push(node.attrs.alt);
    return;
  }
  const spaced = spacedTags.has(node.tag);
  if (spaced) out.push(" ");
  for (const child of node.children) collectText(child, out);
  if (spaced) out.push(" ");
}

export function plainText(source) {
  const out = [];
  for (const node of markdownTree(source)) collectText(node, out);
  return out.join("").replace(/\s+/g, " ").trim();
}

function toDom(node, doc) {
  if (typeof node === "string") return doc.createTextNode(node);
  const target = doc.createElement(node.tag);
  for (const [name, value] of Object.entries(node.attrs))
    target.setAttribute(name, value);
  for (const child of node.children) target.append(toDom(child, doc));
  return target;
}

export function renderMarkdown(source, doc = document) {
  const fragment = doc.createDocumentFragment();
  for (const node of markdownTree(source)) fragment.append(toDom(node, doc));
  return fragment;
}
