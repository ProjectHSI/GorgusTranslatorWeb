export interface LoadingTipInterface {
    quote: string,
    author?: string
}

export type LoadingTip = string | LoadingTipInterface;

export default [
    { quote: "🌲🌲🌲", author: "SpookyDervish" },
    { quote: "you have alerted the glunchers, r u n", author: "SpookyDervish" },
    { quote: "you will be glorpodorped", author: "SpookyDervish" },
    { quote: "does anyone else smell uranium, i'm kinda hungry", author: "SpookyDervish" },
    { quote: "you can technically say \"I will very kill you\" in gorgus \"Zúgúgo kortik̂ googrung.\"", author: "SpookyDervish" },
    { quote: "there used to be a bug where any sentence containing the word \"googrungz\" would crash the translator", author: "SpookyDervish" },
    { quote: "any version of the [desktop] gorgus translator below 1.6 is not on Github, and any version below BETA 1.5 no longer exists, it is lost media.", author: "SpookyDervish" },
    { quote: "when we migrated from SpaCy to NLTK, translation times increased by around 33.3x", author: "SpookyDervish" },
    { quote: "Gorgus was initially a relex, meaning it just replaced English words with Gorgus ones, but SpookyDervish eventually overcomplicated it lol", author: "SpookyDervish" },
    { quote: "We are thinking, just very slowly.", author: "SpookyDervish" },
    { quote: "my god! Gorgan freeman!", author: "SpookyDervish" },
    { quote: "dagunga", author: "SpookyDervish" },
    { quote: "gorila 🦍", author: "SpookyDervish" },

    { quote: "This web translator started as unofficial, but got promoted into an official one.", author: "[Project HSI]" },
    { quote: "All translations are done in the browser - they are never sent to an outside server.", author: "[Project HSI]" },
    { quote: "Any updates done to the desktop version will replicate here too.", author: "[Project HSI]" },
    { quote: "This web translator is really just a wrapper around the desktop version.", author: "[Project HSI]" },
    { quote: "I may have overcomplicated this web translator...", author: "[Project HSI]" },
    { quote: "I helped migrate the translator from SpaCy to NLTK.", author: "[Project HSI]" },
    { quote: "I hope you like this web translator! :D", author: "[Project HSI]" },
    { quote: "There was a bug where changing from English to Gorgus, Gorgus to English, then back, then back again would crash the translator.", author: "[Project HSI]" }
] as LoadingTip[];