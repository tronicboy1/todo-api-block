import "./wc-lit-todos";

function registerBlock(blocks: WpBlocks, element: WpElement, blockEditor: BlockEditor) {
  const el = element.createElement;
  blocks.registerBlockType("create-block/todo-api-block", {
    edit: () => {
      const blockProps = blockEditor.useBlockProps();
      return el("wc-lit-todos", blockProps, "");
    },
    save: () => el("wc-lit-todos", null, ""),
    title: "Todo API",
    category: "widgets",
    icon: "menu",
  });
}

registerBlock(window.wp.blocks, window.wp.element, window.wp.blockEditor);
