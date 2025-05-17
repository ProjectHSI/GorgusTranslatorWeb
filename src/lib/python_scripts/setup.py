import sys
import os
import importlib

def showcaseAllImportsOfModule():
    #importlib.import_module(module)
    print(sys.modules)

def setup_sys_path():
    sys.path.insert(0, "/home/web_user/gorgus/gorgus_translator/")
    sys.path.insert(0, "/home/web_user/gorgus/lib/python3.14/packages/overlays.zip")
    sys.path.append("/home/web_user/gorgus/lib/python3.14/packages")
    #print(sys.path)
    #packages_directory_string = "/home/web_user/gorgus/lib/python3.14/packages"
    #packages_directory = os.fsencode(packages_directory_string)
    #for package in os.listdir(packages_directory):
       #if (package.)

        #package_filename = os.fsdecode(package)
        #package_path = os.path.join(packages_directory_string, package_filename)

        #if package_path.endswith("overlays.zip"):
            #sys.path.insert(0, package_path) # needs to be added before everything else, so it's loaded first
        #else:
            #sys.path.append(package_path)