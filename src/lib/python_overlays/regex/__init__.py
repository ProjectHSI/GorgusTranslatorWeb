# Overlay the (FOR SOME REASON C MODULE) regex lib
# probably for performance... but we can't use C modules in Emscripten, at least efficiently/easily.
# so deal with it :tm:

# Thankfully - "regex" (pip library) is API compatible w/ "re", so we can intentionally namespace pollute here.
#print("regex import")

from re import *