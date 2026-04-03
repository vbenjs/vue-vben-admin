# 第二轮清理：处理动态绑定 description 的页面
# 匹配 <Page title="..." :description="..."> 这种格式

$viewsPath = "c:\Users\dj\Desktop\Project\RISS\apps\web-antd\src\views"

$vueFiles = Get-ChildItem -Path $viewsPath -Filter "*.vue" -Recurse

foreach ($file in $vueFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # 处理动态绑定: <Page title="xxx" :description="pageDescription">
    $content = $content -replace '<Page\s+title="[^"]*"\s+:description="[^"]*"\s*>', '<Page>'
    
    # 处理只有 title 的: <Page title="xxx">
    # 但保留有其他属性的如 @back, :loading 等
    $content = $content -replace '<Page\s+title="[^"]*"\s*>', '<Page>'
    
    # 处理含 @back 等的: <Page title="xxx" @back="..." :loading="...">
    $content = $content -replace '<Page\s+title="[^"]*"\s+(@back="[^"]*")\s*(:loading="[^"]*")?\s*>', '<Page $1 $2>'
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nDone! Round 2 cleanup complete."
