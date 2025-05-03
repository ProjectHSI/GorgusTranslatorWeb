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

Invoke-WebRequest https://patch-diff.githubusercontent.com/raw/python/cpython/pull/133064.patch -OutFile emscriptenFixBuildPatch.patch
git apply --index emscriptenFixBuildPatch.patch

if ($tag -ne "3.14") {
    git checkout $tag
}

python Tools/wasm/emscripten build -- --config-cache

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Python Emscripten!"
    exit 1
}

New-Item -Type Directory ../src/lib/python/wasm
Copy-Item "cross-build/wasm32-emscripten/build/python/web_example/python$tag.zip"  ../src/lib/python/wasm
Copy-Item "cross-build/wasm32-emscripten/build/python/python.wasm"                 ../src/lib/python/wasm
Copy-Item "cross-build/wasm32-emscripten/build/python/python.mjs"                  ../src/lib/python/wasm

Set-Location ..