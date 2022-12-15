import { Block } from "@githubnext/blocks";
import { init } from "@githubnext/blocks-runtime";

import "./index.css";

// redirect from the server to the production blocks frame
if (window === window.top) {
  window.location.href = `https://blocks.githubnext.com/githubnext/blocks-tutorial?devServer=${encodeURIComponent(
    window.location.href
  )}`;
}

const root = document.getElementById("root");

const loadDevServerBlock = async (block: Block) => {
  const imports = import.meta.glob("../blocks/**");
  const importPath = "../" + block.entry;
  const importContent = imports[importPath];
  const content = await importContent();

  console.log({ content });

  let component;

  return (props) => {
    if (component) {
      component.$set(props);
    } else {
      component = new content.default({ target: root, props });
    }
  };
};

init(loadDevServerBlock);
