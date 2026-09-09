Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\USER\.gemini\antigravity-ide\scratch\sinan-portfolio\assets\images\avatar.jpg"
$outputPath = "C:\Users\USER\.gemini\antigravity-ide\scratch\sinan-portfolio\assets\images\avatar.png"
$artifactOutputPath = "C:\Users\USER\.gemini\antigravity-ide\brain\127e1926-ae4c-4617-ad37-e3983ae0147c\sinan_avatar.png"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $src.Width
$height = $src.Height

# Create 32-bit ARGB output bitmap
$dst = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color sampling from top and side corners
# The background in this photo is a soft green/sage tint: R ~ 150-165, G ~ 165-180, B ~ 130-145
# We can sample across top border
$bgSamples = @()
for ($x = 0; $x -lt $width; $x += 20) {
    $bgSamples += $src.GetPixel($x, 0)
    $bgSamples += $src.GetPixel($x, 10)
}
for ($y = 0; $y -lt ($height * 0.7); $y += 20) {
    $bgSamples += $src.GetPixel(0, $y)
    $bgSamples += $src.GetPixel($width - 1, $y)
}

# Compute mean background color
$avgR = 0; $avgG = 0; $avgB = 0
foreach ($s in $bgSamples) {
    $avgR += $s.R; $avgG += $s.G; $avgB += $s.B
}
$avgR /= $bgSamples.Count
$avgG /= $bgSamples.Count
$avgB /= $bgSamples.Count

Write-Host "Detected background average: R=$avgR, G=$avgG, B=$avgB"

# Use Flood-fill / connected component mask from borders to ensure interior is protected
$isBg = New-Object 'bool[,]' $width, $height
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Tolerance parameters for background matching
# Background is distinctly green-dominant (G > R and G > B) with low saturation
function Get-BgDistance($pixel) {
    $dr = $pixel.R - $avgR
    $dg = $pixel.G - $avgG
    $db = $pixel.B - $avgB
    
    # Euclidean distance in RGB
    $dist = [Math]::Sqrt($dr*$dr + $dg*$dg + $db*$db)
    
    # Also check green hue similarity (G > R and G > B)
    $isGreenish = ($pixel.G - $pixel.R -gt -10) -and ($pixel.G - $pixel.B -gt 10)
    
    return [PSCustomObject]@{
        Distance = $dist
        IsGreenish = $isGreenish
    }
}

# Seed from top and upper-left/right edges
for ($x = 0; $x -lt $width; $x++) {
    $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
    $isBg[$x, 0] = $true
}
for ($y = 0; $y -lt $height; $y++) {
    $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
    $isBg[0, $y] = $true
    $queue.Enqueue((New-Object System.Drawing.Point($width - 1, $y)))
    $isBg[$width - 1, $y] = $true
}

$threshold = 42.0
$softThreshold = 58.0

# BFS Flood Fill
$dx = @(0, 0, 1, -1, 1, -1, 1, -1)
$dy = @(1, -1, 0, 0, 1, 1, -1, -1)

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $cx = $pt.X
    $cy = $pt.Y

    for ($i = 0; $i -lt 8; $i++) {
        $nx = $cx + $dx[$i]
        $ny = $cy + $dy[$i]

        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            if (-not $isBg[$nx, $ny]) {
                $p = $src.GetPixel($nx, $ny)
                $res = Get-BgDistance $p
                
                # Check if matches background criteria
                if ($res.Distance -lt $softThreshold -and $res.IsGreenish) {
                    $isBg[$nx, $ny] = $true
                    $queue.Enqueue((New-Object System.Drawing.Point($nx, $ny)))
                }
            }
        }
    }
}

# Generate output image with anti-aliasing alpha
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $p = $src.GetPixel($x, $y)
        
        if ($isBg[$x, $y]) {
            $res = Get-BgDistance $p
            if ($res.Distance -lt $threshold) {
                # Completely transparent
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                # Smooth alpha transition
                $alpha = [Math]::Min(255, [Math]::Max(0, [int](($res.Distance - $threshold) / ($softThreshold - $threshold) * 255)))
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
            }
        } else {
            # Check edge neighbors for smooth border feathering
            $neighborBgCount = 0
            for ($k = 0; $k -lt 8; $k++) {
                $tx = $x + $dx[$k]
                $ty = $y + $dy[$k]
                if ($tx -ge 0 -and $tx -lt $width -and $ty -ge 0 -and $ty -lt $height) {
                    if ($isBg[$tx, $ty]) { $neighborBgCount++ }
                }
            }

            if ($neighborBgCount -gt 0) {
                $res = Get-BgDistance $p
                if ($res.Distance -lt $softThreshold) {
                    $alpha = [Math]::Min(255, [Math]::Max(120, [int](($res.Distance / $softThreshold) * 255)))
                    $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
                } else {
                    $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
                }
            } else {
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            }
        }
    }
}

$dst.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dst.Save($artifactOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$dst.Dispose()

Write-Host "Background removed successfully! Saved to $outputPath"
