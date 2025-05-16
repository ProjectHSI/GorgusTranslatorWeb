$tag = $args[0]
$clone = $args[1]

if ($PSVersionTable.Platform -ne "Unix") {
    Write-Error "Please run this script inside Unix/WSL!"
    exit 1
}

if ($env:EMSDK -eq $null) {
    Write-Error "Please install the Emscripten SDK!"
    exit 1
}

if ($clone -eq $true) {
    git clone https://github.com/python/cpython
}

Set-Location cpython

#Invoke-WebRequest https://patch-diff.githubusercontent.com/raw/python/cpython/pull/133064.patch -OutFile emscriptenFixBuildPatch.patch
#git apply --index emscriptenFixBuildPatch.patch

if ($tag -ne "3.15") {
    git checkout $tag
}

$ENV:EM_COMPILER_WRAPPER=ccache

#python Tools/wasm/emscripten build -- --config-cache --with-pydebug
python Tools/wasm/emscripten configure-build-python -- --config-cache --with-pydebug CC="ccache gcc" CXX="ccache g++"
python Tools/wasm/emscripten make-build-python
python Tools/wasm/emscripten make-libffi
python Tools/wasm/emscripten configure-host -- --config-cache
python Tools/wasm/emscripten make-host

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Python Emscripten!"
    exit 1
}

try { New-Item -Type Directory ../src/lib/python/wasm } catch { }
Copy-Item "cross-build/wasm32-emscripten/build/python/web_example/python$tag.zip"  ../src/lib/python/wasm
Copy-Item "cross-build/wasm32-emscripten/build/python/python.wasm"                 ../src/lib/python/wasm
Copy-Item "cross-build/wasm32-emscripten/build/python/python.mjs"                  ../src/lib/python/wasm

Set-Location ..