<script lang="ts">
	import { gtwHash, gtHash } from "$lib/compileInfo.compile";
</script>

<h1>Gorgus Web Translator</h1>

<table>
	<thead>
		<tr>
			<th>Project</th>
			<th>Git Hash</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Gorgus Translator Web</td>
			<td><span class="gitHash">{gtwHash}</span></td>
		</tr>
		<tr>
			<td>Gorgus Translator</td>
			<td><span class="gitHash">{gtHash}</span></td>
		</tr>
	</tbody>
</table>

<style lang="scss">
  span, h1, p, table {
	font-family: system-ui;
  }

  .gitHash {
    font-family: monospace;
  }

  table {
    border: black 1px solid;
    text-align: center;
  }
</style>