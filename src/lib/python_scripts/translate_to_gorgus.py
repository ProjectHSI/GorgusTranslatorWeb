import sys
import setup

setup.setup_sys_path();

#sys.path.append("lib/python3.14/packages")

print(sys.path)

import urllib
import urllib.request
print(urllib)
print(urllib.request)
#setup.showcaseAllImportsOfModule()

#print(gorgus)

#import os
import translater

print(translater.translate("this is a test", "gorgus"))

#print(os.getcwd())

#print(sys.argv[1])
#print(ntlk.word_tokenize(sys.argv[1]))