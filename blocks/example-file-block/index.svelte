<script lang="ts">
  import type { FileBlockProps } from '@githubnext/blocks';
  export let { content } = $$props as FileBlockProps;
</script>

<h1>Hello from Svelte!</h1>
<pre>
{content}
</pre>

<style>
  h1 {
    color: red;
  }
</style>
