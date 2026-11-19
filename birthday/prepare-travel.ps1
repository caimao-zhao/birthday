$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$rows=Get-Content birthday/travel-rows.json -Raw | ConvertFrom-Json
$trips=@();$current=$null
foreach($row in $rows[1..($rows.Count-1)]){
$v=@($row | ForEach-Object {$_[1]});if($v[2]){$current=@{name=$v[2].Replace('旅游','');photos=@()};$trips+=,$current}
$stem=[IO.Path]::GetFileNameWithoutExtension($v[1]);$file=Get-ChildItem photos | Where-Object BaseName -eq $stem | Select-Object -First 1
if(!$file){throw "Missing $stem"};$img=[Drawing.Image]::FromFile($file.FullName)
if($img.PropertyIdList -contains 274){$o=$img.GetPropertyItem(274).Value[0];switch($o){3{$img.RotateFlip(2)} 6{$img.RotateFlip(1)} 8{$img.RotateFlip(3)}}}
$ratio=[Math]::Min([double]1,1400.0/[Math]::Max($img.Width,$img.Height));$bmp=[Drawing.Bitmap]::new([int]($img.Width*$ratio),[int]($img.Height*$ratio));$g=[Drawing.Graphics]::FromImage($bmp);$g.InterpolationMode='HighQualityBicubic';$g.DrawImage($img,0,0,$bmp.Width,$bmp.Height)
$ms=[IO.MemoryStream]::new();$bmp.Save($ms,[Drawing.Imaging.ImageFormat]::Jpeg)
$current.photos+=@{file=$file.Name;src=('data:image/jpeg;base64,'+[Convert]::ToBase64String($ms.ToArray()))};$g.Dispose();$bmp.Dispose();$img.Dispose();$ms.Dispose()
}
[IO.File]::WriteAllText('E:\生日网站\birthday\trips.js',('const trips='+(ConvertTo-Json -InputObject $trips -Depth 5 -Compress)+';'),[Text.UTF8Encoding]::new($false))
$trips | ForEach-Object { Write-Output ($_.name+': '+$_.photos.Count+' photos') }

