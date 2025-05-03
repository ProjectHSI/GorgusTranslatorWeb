[xml]$nltkIndexXml = Invoke-WebRequest https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/index.xml
#$nltkIndexXml = $nltkIndexString

$packagesToDownload = @( "corpora/wordnet.zip" )

#Write-Host $nltkIndexString
$nltkData = $nltkIndexXml.ChildNodes[2]

foreach ($rootNode in $nltkData.ChildNodes) {
    if ($rootNode.Name -eq "packages") {
        Write-Host "Loading packages..."
        foreach ($packageNode in $rootNode.ChildNodes)
        {
            if ($packageNode.ToString() -ne "package") {
                Write-Host "Malformed XML."
                Exit
            }

            $nltkPackagePath = ($packageNode.url -replace "https://raw.githubusercontent.com/nltk/nltk_data/gh-pages/packages/", "")

            if (!$packagesToDownload.Contains($nltkPackagePath)) {
                continue
            }

            Write-Host $nltkPackagePath

            #$nltkPackageType = ($nltkPackagePath -split "/")[0]

            New-Item -ItemType File -Path ("./src/lib/nltk/" + $nltkPackagePath) -Force | Out-Null

            Invoke-WebRequest $packageNode.url -OutFile $("./src/lib/nltk/" + ($nltkPackagePath -replace "/", "."))
            #Write-Host $packageNode.ToString()
        }
    } elseif ($rootNode.Name -eq "collections") {
        #Write-Host "Loading collections..."
        #for ($v = 0; $v -lt $nltkIndexXml.ChildNodes[$i].Attributes; $v++) {
            #Write-Host $item.Name
        #}
    } else {
        Write-Host "Malformed XML."
        Exit
    }
}