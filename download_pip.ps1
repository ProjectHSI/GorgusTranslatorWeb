#pip install -U pip setuptools wheel
#pip install -r ./Gorgus-Translator/requirements.txt

Remove-Item ./src/lib/python/pip_libs/
pip download -d ./src/lib/python/pip_libs/ -r ./Gorgus-Translator/requirements.txt