import test from "node:test";
import assert from "node:assert/strict";
import { markdownTree, plainText, renderMarkdown } from "../dist/markdown.js";
import { titleFromBody } from "../dist/flow-model.js";

function html(nodes) {
  return nodes
    .map((node) => {
      if (typeof node === "string") return node;
      const attrs = Object.entries(node.attrs)
        .map(([name, value]) => ` ${name}="${value}"`)
        .join("");
      return `<${node.tag}${attrs}>${html(node.children)}</${node.tag}>`;
    })
    .join("");
}

const render = (source) => html(markdownTree(source));

test("paragraphs, emphasis and tight ordered lists render as elements", () => {
  assert.equal(
    render("开头\n\n1. **信息过载。** 现在信息流铺天盖地。\n2. 第二点"),
    "<p>开头</p><ol><li><strong>信息过载。</strong> 现在信息流铺天盖地。</li><li>第二点</li></ol>",
  );
  assert.equal(render("- a\n- b"), "<ul><li>a</li><li>b</li></ul>");
  assert.equal(render("3. a\n4. b"), '<ol start="3"><li>a</li><li>b</li></ol>');
});

test("loose and nested lists keep paragraphs and sublists inside items", () => {
  assert.equal(
    render("1. first\n\n   para two\n2. second\n   - nested\n"),
    "<ol><li><p>first</p><p>para two</p></li><li><p>second</p><ul><li>nested</li></ul></li></ol>",
  );
});

test("task list items render a disabled checkbox", () => {
  assert.equal(
    render("- [x] done\n- [ ] todo"),
    '<ul><li><input type="checkbox" disabled="" checked=""></input>done</li><li><input type="checkbox" disabled=""></input>todo</li></ul>',
  );
});

test("headings, quotes, rules, strikethrough and single line breaks", () => {
  assert.equal(render("## 标题"), "<h2>标题</h2>");
  assert.equal(render("> 引用"), "<blockquote><p>引用</p></blockquote>");
  assert.equal(render("---"), "<hr></hr>");
  assert.equal(render("~~del~~ *em*"), "<p><del>del</del> <em>em</em></p>");
  assert.equal(render("第一行\n第二行"), "<p>第一行<br></br>第二行</p>");
});

test("code keeps angle brackets as text and carries the language class", () => {
  assert.equal(
    render("```js\nlet x = 1 < 2;\n```"),
    '<pre><code class="language-js">let x = 1 < 2;</code></pre>',
  );
  assert.equal(render("`code <x>`"), "<p><code>code <x></code></p>");
});

test("links allow http(s) and mailto and relative targets only", () => {
  assert.equal(
    render('[site](https://a.b "T")'),
    '<p><a href="https://a.b" title="T" target="_blank" rel="noopener">site</a></p>',
  );
  assert.equal(render("[home](#/flow)"), '<p><a href="#/flow">home</a></p>');
  assert.equal(
    render("[mail](mailto:a@b.c)"),
    '<p><a href="mailto:a@b.c">mail</a></p>',
  );
  assert.equal(render("[bad](javascript:alert(1))"), "<p>bad</p>");
  assert.equal(render("[bad](data:text/html,x)"), "<p>bad</p>");
  assert.equal(
    render("![pic](/p.png)"),
    '<p><img src="/p.png" alt="pic" loading="lazy"></img></p>',
  );
  assert.equal(render("![pic](javascript:x)"), "<p>pic</p>");
});

test("raw HTML stays text and is never turned into elements", () => {
  const [paragraph] = markdownTree("<b>raw</b> <script>x()</script>");
  assert.equal(paragraph.tag, "p");
  assert.ok(paragraph.children.includes("<b>"));
  assert.ok(paragraph.children.includes("<script>"));
  assert.ok(paragraph.children.every((child) => typeof child === "string"));
  const [block] = markdownTree("<div>\nblock\n</div>");
  assert.equal(typeof block, "string");
});

test("plainText strips markup and separates blocks with spaces", () => {
  assert.equal(plainText("## 标题\n\n**粗** 体 `code`"), "标题 粗 体 code");
  assert.equal(plainText("1. 一\n2. 二"), "一 二");
  assert.equal(plainText("a\nb"), "a b");
  assert.equal(plainText("![图](/x.png) [链](https://a.b)"), "图 链");
  assert.equal(plainText(""), "");
});

test("body-first titles drop inline markup", () => {
  assert.equal(titleFromBody("## 一个 **念头**\n\n正文"), "一个 念头");
  assert.equal(titleFromBody("- 列表开头"), "列表开头");
});

test("renderMarkdown builds nodes through the document, never innerHTML", () => {
  const calls = [];
  const fakeNode = (kind, value) => ({
    kind,
    value,
    attrs: {},
    children: [],
    setAttribute(name, attr) {
      this.attrs[name] = attr;
    },
    append(child) {
      this.children.push(child);
    },
  });
  const doc = {
    createDocumentFragment: () => fakeNode("fragment"),
    createElement: (tag) => (calls.push(tag), fakeNode("element", tag)),
    createTextNode: (text) => fakeNode("text", text),
  };
  const fragment = renderMarkdown("**粗** <i>x</i>", doc);
  assert.deepEqual(calls, ["p", "strong"]);
  const [paragraph] = fragment.children;
  assert.equal(paragraph.children[0].children[0].value, "粗");
  assert.equal(paragraph.children[2].value, "<i>");
  assert.ok(!("innerHTML" in paragraph));
});
