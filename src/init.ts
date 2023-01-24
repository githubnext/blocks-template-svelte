import type { Block, FileContext, FolderContext } from "@githubnext/blocks";
import { init } from "@githubnext/blocks-runtime";
import BlockComponent from "./BlockComponent.svelte";

import "./index.css";

// redirect from the server to the production blocks frame
if (window === window.top) {
  window.location.href = `https://blocks.githubnext.com/githubnext/blocks?devServer=${encodeURIComponent(
    window.location.href
  )}`;
}

const root = document.getElementById("root");

const loadDevServerBlock = async (block: Block) => {
  const imports = import.meta.glob("../blocks/**");
  const importPath = "../" + block.entry;
  const importContent = imports[importPath];
  const content = await importContent();

  let component;

  return (props) => {
    const fullProps = {
      ...props,
      BlockComponent: getBlockComponentWithParentContext(props.context),
    };
    if (component) {
      component.$set(fullProps);
    } else {
      // @ts-ignore
      component = new content.default({ target: root, props: fullProps });
    }
  };
};

init(loadDevServerBlock);

const getBlockComponentWithParentContext = (
  parentContext?: FileContext | FolderContext
) => {
  class BlockComponentWithParentContext extends BlockComponent {
    constructor(options) {
      let context = {
        ...(parentContext || {}),
        ...(options.parentContext || {}),
      };

      if (parentContext) {
        // clear sha if viewing content from another repo
        const parentRepo = [parentContext.owner, parentContext.repo].join("/");
        const childRepo = [context.owner, context.repo].join("/");
        const isSameRepo = parentRepo === childRepo;
        if (!isSameRepo) {
          context.sha = options.context?.sha || "HEAD";
        }
      }

      const fullOptions = {
        ...options,
        props: {
          ...options.props,
          context,
        },
      };
      super(fullOptions);
    }
  }
  return BlockComponentWithParentContext;
};
