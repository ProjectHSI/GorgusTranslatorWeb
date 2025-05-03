#import urllib.parse

print("d")

class HTTPPasswordMgrWithDefaultRealm:
    def add_password(self):
        print("HTTPPasswordMgrWithDefaultRealm.add_password call; stub")

class ProxyBasicAuthHandler:
    def __init__(self):
        print("ProxyBasicAuthHandler.__new__ call; stub")
        #ProxyBasicAuthHandler(self):

class ProxyDigestAuthHandler:
    def __init__(self):
        print("ProxyDigestAuthHandler.__new__ call; stub")
        #ProxyBasicAuthHandler(self):

class ProxyHandler:
    def __init__(self):
        print("ProxyHandler.__new__ call; stub")

def build_opener():
    print("build_opener call; stub")

def install_opener():
    print("install_opener call; stub")

def getproxies():
    print("getproxies call; stub")

# we aren't going to parse ridiculous binary garbage in here (i hope...), so a simple replacement will suffice.
def url2pathname(url):
    return url.removeprefix("//").replace("%20", " ")
