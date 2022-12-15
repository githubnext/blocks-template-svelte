<script lang="ts">
  import { FileBlockProps } from '@githubnext/blocks';

  // export let content: string;
  // export let context: FileBlockProps['context'];
  // export let onRequestGitHubData: FileBlockProps['onRequestGitHubData'];

  let { content, context, onRequestGitHubData } = $$props as FileBlockProps;

  const onClick = async () => {
    const commits = await onRequestGitHubData(`/repos/${context.owner}/${context.repo}/commits`)
    console.log({ commits });
  }
</script>

<h1>Hello!</h1>
<pre>
{content}
</pre>

<button on:click={onClick}>Click me</button>

<style>
  h1 {
    color: red;
  }
</style>
