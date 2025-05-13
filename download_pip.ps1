#pip install -U pip setuptools wheel
#pip install -r ./Gorgus-Translator/requirements.txt

try {
    Remove-Item ./src/lib/python/pip_libs/ -Recurse -Force -Confirm:$false;
} catch { }
pip download -d ./src/lib/python/pip_libs/ -r ./Gorgus-Translator/requirements.txt