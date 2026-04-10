# CloudBase 云函数上传脚本 (PowerShell)
# 环境ID: vera-liu-space-6g2h5zpq5043f8fe

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CloudBase 云函数上传工具" -ForegroundColor Cyan
Write-Host "  环境ID: vera-liu-space-6g2h5zpq5043f8fe" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$envId = "vera-liu-space-6g2h5zpq5043f8fe"
$cloudfunctionsPath = ".\cloudfunctions"

# 检查 cloudfunctions 目录是否存在
if (-not (Test-Path $cloudfunctionsPath)) {
    Write-Host "❌ 错误: 找不到 cloudfunctions 目录" -ForegroundColor Red
    exit 1
}

# 定义要上传的云函数列表
$functions = @(
    "initDatabase",
    "userLogin", 
    "getUserInfo",
    "updateUserInfo"
)

Write-Host "📦 准备上传以下云函数:" -ForegroundColor Yellow
foreach ($func in $functions) {
    Write-Host "   - $func" -ForegroundColor White
}
Write-Host ""

# 检查是否安装了 CloudBase CLI
$cliInstalled = $false
try {
    $version = & tcb --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $cliInstalled = $true
        Write-Host "✅ CloudBase CLI 已安装: $version" -ForegroundColor Green
    }
} catch {
    $cliInstalled = $false
}

if (-not $cliInstalled) {
    Write-Host "⚠️  未检测到 CloudBase CLI" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请选择上传方式:" -ForegroundColor Cyan
    Write-Host "1. 使用微信开发者工具手动上传（推荐）" -ForegroundColor White
    Write-Host "2. 先安装 CloudBase CLI 后再上传" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "请输入选择 (1/2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  使用微信开发者工具上传步骤:" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "1️⃣  设置云环境:" -ForegroundColor Yellow
        Write-Host "   右键点击 cloudfunctions 文件夹" -ForegroundColor White
        Write-Host "   → 当前环境" -ForegroundColor White
        Write-Host "   → 选择: $envId" -ForegroundColor White
        Write-Host ""
        
        Write-Host "2️⃣  依次上传每个云函数:" -ForegroundColor Yellow
        foreach ($func in $functions) {
            Write-Host "   右键 cloudfunctions/$func" -ForegroundColor White
            Write-Host "   → 上传并部署:云端安装依赖" -ForegroundColor White
            Write-Host ""
        }
        
        Write-Host "💡 提示: 每个云函数上传约需 15-20 秒" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "完成后，在控制台执行以下命令初始化数据库:" -ForegroundColor Yellow
        Write-Host "wx.cloud.callFunction({ name: 'initDatabase' })" -ForegroundColor White
        Write-Host ""
        
        # 打开文档
        $openDocs = Read-Host "是否打开详细上传指南? (y/n)"
        if ($openDocs -eq "y" -or $openDocs -eq "Y") {
            Start-Process "UPLOAD_CLOUD_FUNCTIONS.md"
        }
        
        exit 0
    } else {
        Write-Host ""
        Write-Host "正在安装 CloudBase CLI..." -ForegroundColor Yellow
        
        # 检查是否安装了 Node.js
        try {
            $nodeVersion = & node --version 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ 错误: 未检测到 Node.js" -ForegroundColor Red
                Write-Host "请先安装 Node.js: https://nodejs.org/" -ForegroundColor Yellow
                exit 1
            }
        } catch {
            Write-Host "❌ 错误: 未检测到 Node.js" -ForegroundColor Red
            Write-Host "请先安装 Node.js: https://nodejs.org/" -ForegroundColor Yellow
            exit 1
        }
        
        # 安装 CloudBase CLI
        Write-Host "执行: npm install -g @cloudbase/cli" -ForegroundColor White
        npm install -g @cloudbase/cli
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ CloudBase CLI 安装失败" -ForegroundColor Red
            exit 1
        }
        
        Write-Host "✅ CloudBase CLI 安装成功" -ForegroundColor Green
    }
}

# 登录 CloudBase
Write-Host ""
Write-Host "🔐 正在登录 CloudBase..." -ForegroundColor Yellow
tcb login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 登录失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 登录成功" -ForegroundColor Green
Write-Host ""

# 上传云函数
Write-Host "📤 开始上传云函数..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($func in $functions) {
    Write-Host "[$($functions.IndexOf($func) + 1)/$($functions.Count)] 上传 $func..." -ForegroundColor Cyan
    
    $funcPath = Join-Path $cloudfunctionsPath $func
    
    if (-not (Test-Path $funcPath)) {
        Write-Host "   ❌ 跳过: 目录不存在" -ForegroundColor Red
        $failCount++
        continue
    }
    
    # 上传云函数
    tcb functions:deploy $func --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ 上传成功" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "   ❌ 上传失败" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# 总结
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  上传完成!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 成功: $successCount" -ForegroundColor Green
Write-Host "❌ 失败: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 所有云函数上传成功!" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步: 初始化数据库" -ForegroundColor Yellow
    Write-Host "在微信开发者工具控制台执行:" -ForegroundColor White
    Write-Host "wx.cloud.callFunction({ name: 'initDatabase' })" -ForegroundColor Cyan
    Write-Host ""
    
    $initDb = Read-Host "是否现在初始化数据库? (y/n)"
    if ($initDb -eq "y" -or $initDb -eq "Y") {
        Write-Host ""
        Write-Host "🗄️  正在初始化数据库..." -ForegroundColor Yellow
        tcb functions:invoke initDatabase
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 数据库初始化成功!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  初始化失败，请在微信开发者工具中手动执行" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  部分云函数上传失败，请检查错误信息" -ForegroundColor Yellow
    Write-Host "建议: 使用微信开发者工具手动上传失败的云函数" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
