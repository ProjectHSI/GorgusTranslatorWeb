import type {RAIITranslator} from "$lib/RAIITranslator.svelte";
import {getContext, setContext} from "svelte";

/**
 * It is recommended that this class is instantiated in the $state() Svelte Rune.
 * This allows $derived() as well as $effect() to be used.
 */
export interface TranslatorState {
    translatorReady: boolean,
    raiiTranslator?: RAIITranslator
}

export function getTranslatorState(): TranslatorState {
    return getContext('translatorState');
}

export function setTranslatorState(newContext: TranslatorState) {
    return setContext('translatorState', newContext);
}