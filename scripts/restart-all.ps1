# ============================================================
# RISS 全环境一键重启脚本
# 用法: powershell -ExecutionPolicy Bypass -File scripts/restart-all.ps1
# ============================================================

param(
    [switch]$SkipDocker,      # 跳过 Docker 容器重启
    [switch]$FrontendOnly,    # 仅重启前端
    [switch]$BackendOnly      # 仅重启后端
)

$ErrorActionPreference = "Continue"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ServerDir = Join-Path $ProjectRoot "apps\server"
$WebDir = Join-Path $ProjectRoot "apps\web-antd"

# 颜色输出辅助函数
function Write-Step($msg) { Write-Host "`n🔹 $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  ✅ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  ⚠️  $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "  ❌ $msg" -ForegroundColor Red }

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     RISS 全环境一键重启                  ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Magenta

# ============================================================
# 第1步: 关闭已有的 Node 开发进程
# ============================================================
Write-Step "关闭已有的开发进程..."

# 关闭 vite 相关进程 (前端)
$viteProcs = Get-WmiObject Win32_Process | Where-Object {
    $_.CommandLine -match 'vite' -and
    $_.CommandLine -match 'web-antd' -and
    $_.CommandLine -notmatch 'Antigravity'
}
foreach ($p in $viteProcs) {
    try { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }
    catch {}
}

# 关闭 nest 相关进程 (后端)
$nestProcs = Get-WmiObject Win32_Process | Where-Object {
    $_.CommandLine -match 'nest' -and
    $_.CommandLine -match 'server' -and
    $_.CommandLine -notmatch 'Antigravity'
}
foreach ($p in $nestProcs) {
    try { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }
    catch {}
}

# 释放可能被占用的端口
$ports = @(5555, 5666)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        foreach ($c in $conn) {
            try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue }
            catch {}
        }
        Write-Ok "端口 $port 已释放"
    }
}

Write-Ok "旧进程已清理"

# ============================================================
# 第2步: 启动 Docker 容器 (MySQL + Redis)
# ============================================================
if (-not $SkipDocker -and -not $FrontendOnly -and -not $BackendOnly) {
    Write-Step "检查并启动 Docker 容器 (MySQL + Redis)..."

    # 检查 Docker 是否在运行
    $dockerRunning = $false
    try {
        $dockerInfo = docker info 2>&1
        if ($LASTEXITCODE -eq 0) { $dockerRunning = $true }
    } catch {}

    if (-not $dockerRunning) {
        Write-Warn "Docker Desktop 未运行, 正在启动..."
        $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        if (Test-Path $dockerPath) {
            Start-Process $dockerPath
            # 等待 Docker 就绪, 最多等 30 秒
            $waited = 0
            while ($waited -lt 30) {
                Start-Sleep -Seconds 2
                $waited += 2
                try {
                    docker info 2>&1 | Out-Null
                    if ($LASTEXITCODE -eq 0) {
                        $dockerRunning = $true
                        break
                    }
                } catch {}
                Write-Host "    等待 Docker 就绪... ($waited 秒)" -ForegroundColor Gray
            }
        }
    }

    if ($dockerRunning) {
        Push-Location $ServerDir
        docker-compose up -d 2>&1 | Out-Null
        Pop-Location
        Write-Ok "Docker 容器已启动 (MySQL:3307, Redis:16379)"
    } else {
        Write-Err "Docker 启动超时, 请手动检查"
    }
}

# ============================================================
# 第3步: 启动后端 NestJS 服务
# ============================================================
if (-not $FrontendOnly) {
    Write-Step "启动后端 NestJS 服务 (端口 5555)..."
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$ServerDir'; pnpm start:dev" -WindowStyle Minimized

    # 等待后端端口就绪, 最多 20 秒
    $waited = 0
    while ($waited -lt 20) {
        Start-Sleep -Seconds 1
        $waited++
        $conn = Get-NetTCPConnection -LocalPort 5555 -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            Write-Ok "后端服务已就绪 (http://localhost:5555)"
            break
        }
    }
    if ($waited -ge 20) {
        Write-Warn "后端服务启动中, 可能需要更多时间..."
    }
}

# ============================================================
# 第4步: 启动前端 Vite 开发服务
# ============================================================
if (-not $BackendOnly) {
    Write-Step "启动前端 Vite 开发服务 (端口 5666)..."
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$WebDir'; pnpm run dev" -WindowStyle Minimized

    # 等待前端端口就绪, 最多 30 秒
    $waited = 0
    while ($waited -lt 30) {
        Start-Sleep -Seconds 1
        $waited++
        $conn = Get-NetTCPConnection -LocalPort 5666 -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            Write-Ok "前端服务已就绪 (http://localhost:5666)"
            break
        }
    }
    if ($waited -ge 30) {
        Write-Warn "前端服务启动中, 可能需要更多时间..."
    }
}

# ============================================================
# 完成汇总
# ============================================================
$stopwatch.Stop()
$elapsed = $stopwatch.Elapsed

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     🚀 RISS 系统启动完成!               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  ⏱️  耗时: $([math]::Round($elapsed.TotalSeconds, 1)) 秒" -ForegroundColor White
Write-Host "  🌐 前端: http://localhost:5666/" -ForegroundColor White
Write-Host "  🔧 后端: http://localhost:5555/api" -ForegroundColor White
Write-Host "  🐬 MySQL: localhost:3307" -ForegroundColor White
Write-Host "  📦 Redis: localhost:16379" -ForegroundColor White
Write-Host ""
