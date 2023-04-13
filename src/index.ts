import "./wc-lit-todos";

function registerBlock(blocks: WpBlocks, element: WpElement) {
  const el = element.createElement;
  blocks.registerBlockType("create-block/todo-api-block", {
    edit: () => el("wc-lit-todos", null, ""),
    save: () => el("wc-lit-todos", null, ""),
    title: "Todo API",
    category: "widgets",
    icon: "menu",
  });
}

registerBlock(window.wp.blocks, window.wp.element);
