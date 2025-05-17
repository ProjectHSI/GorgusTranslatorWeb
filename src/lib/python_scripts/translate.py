#print ("script run...")
import json
import sys
import setup
import re
import base64
from time import time

#print("import...")

setup.setup_sys_path()

#sys.path.append("lib/python3.14/packages")

#print(sys.path)

import urllib
#import urllib.request
#print(urllib)
#print(urllib.request)
#setup.showcaseAllImportsOfModule()

#print(gorgus)

#import os
import translations
import translater

rich_text_regex = re.compile("\\[.*?]")

def create_dictionary_word(word):
    word_output = { "word": word, "english_words": translations.translation_dictionary[word] }

    if word in translations.dictionary_information.informal_words:
        word_output["informal"] = True
    else:
        word_output["informal"] = False

    if word in translations.dictionary_information.extra_info:
        word_output["extra_info"] = rich_text_regex.sub("", translations.dictionary_information.extra_info[word])

def get_dictionary():
    words = []

    for gorgus_word in translations.translation_dictionary:
        if gorgus_word.startswith("<") and gorgus_word.endswith(">"):
            continue

        words.append(create_dictionary_word(gorgus_word))

    return json.dumps(words)

#translate_re_e = re.compile("\\[GTW_I]: \\[(E)]: \\{(.*)}")
translate_re = re.compile("\\[GTW_I]: \\[([EG]) \\[(!?)F]]: \\{(.*)}")
dictionary_re = re.compile("\\[GTW_I]: \\[DG]")

print('[GTW_O]: runtime_ready')

#the_thing = time()

while True:
    try:
        #print("getting input...")
        line = input()
    except EOFError:
        #print("received eof!")
        continue # try again
    except:
        continue
    #print(line)

    #print("sanity")

    if line.rstrip() == "":
        continue

    if not line.rstrip().startswith("[GTW_I]: "):
        print("[GTW_O]: [IW]: Invalid command! (stdin didn't start w/ [GTW_I])")
        continue

    #print("regex match")

    translate_re_match = translate_re.match(line.rstrip())
    dictionary_re_match = dictionary_re.match(line.rstrip())

    #print(translate_re_match[1])
    #print(translate_re_match[2])
    #print(translate_re_match[3])
    #print(translate_re_match[4])

    if translate_re_match is not None:
        #print("translate branch")
        #if translate_re_match[1] == "G":
        print("[GTW_O]: [TO]: [" + translate_re_match[1] + " [" + translate_re_match[2] + "F]] {" + translate_re_match[3] + "} {" + base64.b64encode(
            translater.translate(
                base64.b64decode(
                    translate_re_match[3]
                ).decode("utf-8"),
                "gorgus" if translate_re_match[1] == "G" else "english",
                translate_re_match[2] != "!", True
            ).encode("utf-8")
        ).decode("utf-8") + "}")
        #print(translate_re_match[1], translate_re_match[2])
    elif dictionary_re_match is not None:
        print(f"[GTW_O]: [D]: {get_dictionary()}")
    else:
        print("[GTW_O]: [IW]: Invalid command! (didn't match any regex)")
        continue

print("exit")


#print(time() - the_thing)

#print(os.getcwd())

#print(sys.argv[1]
#print(ntlk.word_tokenize(sys.argv[1]))