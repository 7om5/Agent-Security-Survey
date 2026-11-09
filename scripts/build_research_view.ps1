# Regenerate the offline snapshot with PowerShell 7 from any working directory.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location -LiteralPath $root
try {
    function Read-JsonFile($path) {
        Get-Content -LiteralPath $path -Raw -Encoding utf8 | ConvertFrom-Json -AsHashtable
    }
    function Index-ById($records) {
        $index = @{}
        foreach ($record in $records) {
            if ($index.ContainsKey($record.id)) { throw "Duplicate paper ID: $($record.id)" }
            $index[$record.id] = $record
        }
        return $index
    }
    $manifest = Import-Csv -LiteralPath registry/paper_manifest.csv
    $topics = Index-ById (Read-JsonFile 'registry/paper_topics_v1_1.json')
    $metadata = Index-ById (Read-JsonFile 'research/phase3/paper_metadata.json')
    $status = Index-ById (Import-Csv -LiteralPath registry/paper_status.csv)
    $scores = @(Read-JsonFile 'research/phase3/direction_scores_full.json')
    $papers = foreach ($row in ($manifest | Sort-Object id)) {
        $id = $row.id
        $note = "notes/$id.md"
        $topic = $topics[$id]
        $meta = $metadata[$id]
        if (!$topic -or !$meta -or !$status[$id] -or !(Test-Path -LiteralPath $row.pdf_path -PathType Leaf)) { throw "Missing record or PDF: $id" }
        $header = Get-Content -Encoding utf8 -LiteralPath $note -TotalCount 25
        $byline = $header | Where-Object { $_ -match '^[*-]\s*\*{0,2}作者' } | Select-Object -First 1
        if ($byline) { $byline = ($byline -replace '^.*?[：:]\s*', '' -replace '\*\*','').Trim() }
        [ordered]@{
            id = $id; title = $row.title; pdf = $row.pdf_path; pages = [int]$row.total_pages
            byline = $byline; venue = $meta.venue; year = $meta.publication_year
            type = $meta.publication_type; status = $meta.publication_status; read = $status[$id].status
            leaf = $topic.v1_1_primary; subtype = $topic.subtype; secondary = $topic.secondary_categories
            tags = $topic.cross_tags; evidence = $topic.evidence_note; confidence = $topic.confidence
        }
    }
    if ($papers.Count -ne 124 -or ($papers.id | Sort-Object -Unique).Count -ne 124 -or ($papers.pdf | Sort-Object -Unique).Count -ne 124) { throw 'Expected 124 unique papers and PDFs' }
    $documents = [ordered]@{}
    $sources = @(Get-ChildItem -LiteralPath notes,taxonomy,research -Recurse -Filter '*.md' -File)
    $sources += Get-Item -LiteralPath '当前调研进展.md','CLAUDE_CODE_RESEARCH_HANDOFF.md','logs/phase1_acceptance_2026-11-03.md','logs/phase2_report.md','logs/phase2_consistency_check.md','logs/checkpoint_2026-11-06.md'
    foreach ($source in $sources) {
        $key = [IO.Path]::GetRelativePath($root, $source.FullName).Replace('\','/')
        $documents[$key] = (ConvertFrom-Markdown -LiteralPath $source.FullName).Html
    }
    $snapshot = [ordered]@{
        papers = @($papers); taxonomy = Read-JsonFile 'taxonomy/taxonomy_v1_1.json'
        scores = $scores; candidates = @(Read-JsonFile 'research/phase4/candidate_index.json'); docs = $documents
    }
    $json = ConvertTo-Json -InputObject $snapshot -Depth 15 -Compress
    $out = Join-Path $root 'research-view/data.js'
    [IO.File]::WriteAllText($out, "window.RESEARCH_DATA = $json;", [Text.UTF8Encoding]::new($false))
    Write-Output "Built $($papers.Count) paper records and $($documents.Count) readable documents."
} finally { Pop-Location }
