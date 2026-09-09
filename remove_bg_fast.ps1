$code = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class ImageProcessor
{
    public static void RemoveBackground(string inputPath, string outputPath)
    {
        using (Bitmap src = new Bitmap(inputPath))
        {
            int width = src.Width;
            int height = src.Height;

            BitmapData srcData = src.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.ReadOnly, PixelFormat.Format24bppRgb);
            int stride = srcData.Stride;
            byte[] rawBytes = new byte[stride * height];
            Marshal.Copy(srcData.Scan0, rawBytes, 0, rawBytes.Length);
            src.UnlockBits(srcData);

            // Sample background color from corners
            long sumR = 0, sumG = 0, sumB = 0;
            int count = 0;
            for (int x = 0; x < width; x += 10)
            {
                int idx = 0 * stride + x * 3;
                sumB += rawBytes[idx]; sumG += rawBytes[idx + 1]; sumR += rawBytes[idx + 2];
                count++;
            }
            for (int y = 0; y < height * 0.7; y += 10)
            {
                int idx1 = y * stride + 0 * 3;
                int idx2 = y * stride + (width - 1) * 3;
                sumB += rawBytes[idx1] + rawBytes[idx2];
                sumG += rawBytes[idx1 + 1] + rawBytes[idx2 + 1];
                sumR += rawBytes[idx1 + 2] + rawBytes[idx2 + 2];
                count += 2;
            }

            double avgB = (double)sumB / count;
            double avgG = (double)sumG / count;
            double avgR = (double)sumR / count;

            bool[,] isBg = new bool[width, height];
            Queue<Point> queue = new Queue<Point>();

            // Color distance check
            // The studio background is olive green (G > R and G > B)
            Func<int, int, bool> isBgPixel = (x, y) =>
            {
                int idx = y * stride + x * 3;
                double b = rawBytes[idx];
                double g = rawBytes[idx + 1];
                double r = rawBytes[idx + 2];

                double dr = r - avgR;
                double dg = g - avgG;
                double db = b - avgB;
                double dist = Math.Sqrt(dr * dr + dg * dg + db * db);

                // Strong green component relative to red/blue
                bool greenDominance = (g - r >= -12) && (g - b >= 10);
                return dist < 55.0 && greenDominance;
            };

            // Seed outer border
            for (int x = 0; x < width; x++)
            {
                if (isBgPixel(x, 0)) { isBg[x, 0] = true; queue.Enqueue(new Point(x, 0)); }
            }
            for (int y = 0; y < height; y++)
            {
                if (isBgPixel(0, y)) { isBg[0, y] = true; queue.Enqueue(new Point(0, y)); }
                if (isBgPixel(width - 1, y)) { isBg[width - 1, y] = true; queue.Enqueue(new Point(width - 1, y)); }
            }

            int[] dx = { 0, 0, 1, -1, 1, -1, 1, -1 };
            int[] dy = { 1, -1, 0, 0, 1, 1, -1, -1 };

            while (queue.Count > 0)
            {
                Point pt = queue.Dequeue();
                for (int i = 0; i < 8; i++)
                {
                    int nx = pt.X + dx[i];
                    int ny = pt.Y + dy[i];
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height)
                    {
                        if (!isBg[nx, ny] && isBgPixel(nx, ny))
                        {
                            isBg[nx, ny] = true;
                            queue.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            // Create output 32-bit ARGB image
            using (Bitmap dst = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                BitmapData dstData = dst.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                byte[] outBytes = new byte[width * height * 4];

                for (int y = 0; y < height; y++)
                {
                    for (int x = 0; x < width; x++)
                    {
                        int srcIdx = y * stride + x * 3;
                        int dstIdx = (y * width + x) * 4;

                        byte b = rawBytes[srcIdx];
                        byte g = rawBytes[srcIdx + 1];
                        byte r = rawBytes[srcIdx + 2];

                        if (isBg[x, y])
                        {
                            outBytes[dstIdx] = 0;
                            outBytes[dstIdx + 1] = 0;
                            outBytes[dstIdx + 2] = 0;
                            outBytes[dstIdx + 3] = 0; // Transparent
                        }
                        else
                        {
                            // Check distance to background for soft anti-aliasing
                            int neighborBg = 0;
                            for (int k = 0; k < 8; k++)
                            {
                                int nx = x + dx[k];
                                int ny = y + dy[k];
                                if (nx >= 0 && nx < width && ny >= 0 && ny < height && isBg[nx, ny])
                                {
                                    neighborBg++;
                                }
                            }

                            byte alpha = 255;
                            if (neighborBg > 0)
                            {
                                double dr = r - avgR;
                                double dg = g - avgG;
                                double db = b - avgB;
                                double dist = Math.Sqrt(dr * dr + dg * dg + db * db);
                                alpha = (byte)Math.Min(255, Math.Max(120, (int)(dist / 55.0 * 255.0)));
                            }

                            outBytes[dstIdx] = b;
                            outBytes[dstIdx + 1] = g;
                            outBytes[dstIdx + 2] = r;
                            outBytes[dstIdx + 3] = alpha;
                        }
                    }
                }

                Marshal.Copy(outBytes, 0, dstData.Scan0, outBytes.Length);
                dst.UnlockBits(dstData);
                dst.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$inputPath = "C:\Users\USER\.gemini\antigravity-ide\scratch\sinan-portfolio\assets\images\avatar.jpg"
$outputPath = "C:\Users\USER\.gemini\antigravity-ide\scratch\sinan-portfolio\assets\images\avatar.png"
$artifactPath = "C:\Users\USER\.gemini\antigravity-ide\brain\127e1926-ae4c-4617-ad37-e3983ae0147c\sinan_avatar.png"

[ImageProcessor]::RemoveBackground($inputPath, $outputPath)
Copy-Item -Path $outputPath -Destination $artifactPath -Force
Write-Host "Success! Background removed cleanly in milliseconds."
