<script lang="ts">
  import type { FileContext, FolderContext, Block } from "@githubnext/blocks";

  export let context: FileContext | FolderContext;
  export let block: Block;

  $: hash = encodeURIComponent(
    JSON.stringify({
      block: {
        owner: block.owner,
        repo: block.repo,
        id: block.id,
        type: block.type,
      },
      context,
    })
  );
</script>

<iframe
  title="embedded block"
  src={`/#${hash}`}
  sandbox={"allow-scripts allow-same-origin allow-forms allow-downloads"}
/>

<style>
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>
