# We can't properly polyfill this module. I am not making Spacy in pure Python.
# I did however notice that some parts of spacy could be replaced with nltk, especially in Gorgus.

import nltk

#class SpacyNaturalLanguageProcessingObject:
#    def __init__(self, data):
#        print(data)

class SpacyNaturalLangaugeProcessing:
    def __init__(self):
        print("SpacyNaturalLanguageProcessing init;")
    def __call__(self, data):
        print("SpacyNaturalLanguageProcessing __call__;")
        return nltk.doc(data)
        #raise Exception("EXIT!")


def load(model):
    if model != "en_core_web_sm":
        raise Exception("Unexpected model input for Spacy Polyfill")
    return SpacyNaturalLangaugeProcessing()