<script lang="ts">
    import {getTranslatorState, type TranslatorState} from "$lib/TranslatorStateManagement";
    import {PythonWorker} from "$lib/PythonWorker.Types";
    import * as sea from "node:sea";

    let translatorState: TranslatorState = getTranslatorState();

    async function getDictionary() {
        if (translatorState.raiiTranslator !== undefined && translatorState.translatorReady) {
            return await translatorState.raiiTranslator.getDictionary()
        } else
            throw new Error("getDictionary() [callsite] Logic Error #1")
    }

    let _dictionary: PythonWorker.Dictionary | undefined = $state();

    let searchTerm = $state("");
    let siftedDictionary = $derived.by(() => {
        if (!_dictionary)
            return undefined;

        let workingDictionary: PythonWorker.Dictionary = _dictionary;

        if (searchTerm) {
            console.log("searchTerm...")

            let searchingDictionary: PythonWorker.Dictionary = [];

            for (const workingDictionaryElement of workingDictionary) {
                let isElementIncluded = false;

                if (typeof (workingDictionaryElement.english_words) === 'string') {
                    if (workingDictionaryElement.english_words.startsWith(searchTerm)) {
                        isElementIncluded = true;
                    }
                } else {
                    for (const englishWord of workingDictionaryElement.english_words) {
						if (englishWord.startsWith(searchTerm)) {
                            isElementIncluded = true;
						}
                    }
                }

                if (workingDictionaryElement.word.startsWith(searchTerm)) {
                    isElementIncluded = true;
                }

                if (isElementIncluded)
                    searchingDictionary.push(workingDictionaryElement);
            }

            workingDictionary = searchingDictionary;
        }

        return workingDictionary;
    });

    let maxEnglishWords = $derived.by(() => {
        if (!siftedDictionary)
            return 1;

        let newMaximum = 1;
        for (const dictionaryWord of siftedDictionary) {
            if (typeof (dictionaryWord.english_words) !== 'string' && dictionaryWord.english_words.length > newMaximum) {
                newMaximum = dictionaryWord.english_words.length
            }
        }

        return newMaximum;
    });

    $effect(() => {
        if (translatorState.raiiTranslator !== undefined && translatorState.translatorReady) {
            getDictionary().then((dictionary) => {
                _dictionary = dictionary;
                console.log(_dictionary);
            });
        }
    });

    /*    onMount(() => {
			console.log("onMount")

			if (translatorReady)
				getDictionary();
		})*/
</script>

<h1 style:margin-top="0">Dictionary</h1>

<input bind:value={searchTerm} placeholder="Search for a word..." style:width="25%">

<br /><br />

{#if siftedDictionary}
	<table class="mainDictionaryTable">
		<thead>
			<tr>
				<th class="mainDictionaryTh">Word</th>
				<th class="mainDictionaryTh">English</th>
				<th class="mainDictionaryTh">Notes</th>
			</tr>
		</thead>
		<tbody>
		{#each siftedDictionary as dictionaryWord, i}
			<!--{@const test = console.log(dictionaryWord)}-->
			<tr>
				<td class="mainDictionaryTd">{dictionaryWord.word}</td>
				<!--<td style:padding="0">
					<div class="englishWordList">
						{#each (typeof (dictionaryWord.english_words) === 'string' ? [dictionaryWord.english_words] : dictionaryWord.english_words) as englishWord}
							<span>{englishWord}</span>
						{/each}
					</div>
				</td>-->
				<!--{#if typeof (dictionaryWord.english_words) === 'string'}
					<td colspan={maxEnglishWords}>{dictionaryWord.english_words}</td>
				{:else}
					{#each dictionaryWord.english_words as englishWord, englishWordIndex}
						<td colspan={
							englishWordIndex === dictionaryWord.english_words.length - 1
							? maxEnglishWords - englishWordIndex
							: 1}>{englishWord}</td>
					{/each}
				{/if}-->
				<td class="mainDictionaryTd">
					<div class="englishWordContainer">
						<table class="englishWordTable">
							<tbody>
								<tr>
									{#if typeof (dictionaryWord.english_words) === 'string'}
										<td style:width="98%" class="englishWordTd">{dictionaryWord.english_words}</td>
									{:else}
										{#each dictionaryWord.english_words as englishWord, englishWordIndex}
											<td style:width={`calc(${((100 / dictionaryWord.english_words.length) - 2)}% - 8px)`} class="englishWordTd">{englishWord}</td>
										{/each}
									{/if}
								</tr>
							</tbody>
						</table>
					</div>
				</td>
				<td class="mainDictionaryTd">
					{#if dictionaryWord.informal}
						<span style:color="red">
							{#if dictionaryWord.extra_info}
								Informal;
							{:else}
								Informal
							{/if}
						</span>
					{/if}
					{dictionaryWord.extra_info}
				</td>
				<!--<td style:padding="0" style:border-left="0" style:border-right="0">
					<table class="englishWordTable">
						<tbody>
							<tr>
								{#if (typeof (dictionaryWord.english_words) == "string")}
									<td class="englishWordTd">{dictionaryWord.english_words}</td>
								{:else}
									{#each dictionaryWord.english_words as englishWord}
										<td class="englishWordTd">{englishWord}</td>
									{/each}
								{/if}
							</tr>
						</tbody>
					</table>
				</td>-->
			</tr>
		{/each}
		</tbody>
	</table>
{/if}

<style lang="scss">
  .mainDictionaryTable, .mainDictionaryTh, .mainDictionaryTd {
    border: solid 1px black;

    border-collapse: collapse;

    text-align: center;
  }

  .mainDictionaryTd, .mainDictionaryTh {
    padding-left: 4px;
    padding-right: 4px;
  }

  .englishWordTable {
    flex-grow: 1;

    //border: 0;
    //border: 0;
    border-collapse: collapse;
  }

  .englishWordTd {
    border-left: solid 1px black;
    border-right: solid 1px black;

    padding-left: 4px;
    padding-right: 4px;
  }

  .englishWordTd:first-child {
    border-left: 0;
  }

  .englishWordTd:last-child {
    border-right: 0;
  }

  .englishWordContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .englishWordList {
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

    //height: 100%;
  }

  .englishWordList span {
    margin: 0;

    padding-left: 4px;
    padding-right: 4px;

    border-right: thin solid black;
    border-left: thin solid black;
  }

  .englishWordList span:first-child {
    border-left: 0;
  }

  .englishWordList span:last-child {
    border-right: 0;
  }
</style>