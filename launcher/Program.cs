using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;

namespace NetBoostPro
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string scriptPath = Path.Combine(appDir, @"scripts\desktop-agent.ps1");
            string distPath = Path.Combine(appDir, @"dist\index.html");

            // Universal self-contained fallback: If files do not exist beside executable
            // (e.g. running from a friend's Downloads folder or desktop), deploy to LocalAppData
            string installDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "NetBoostPro");

            if (!File.Exists(scriptPath) || !File.Exists(distPath))
            {
                scriptPath = Path.Combine(installDir, @"scripts\desktop-agent.ps1");
                distPath = Path.Combine(installDir, @"dist\index.html");

                if (!File.Exists(scriptPath) || !File.Exists(distPath))
                {
                    ExtractEmbeddedPayload(installDir);
                }
                appDir = installDir;
            }

            // 1. Ensure backend agent is running
            if (!IsBackendRunning(48123))
            {
                if (File.Exists(scriptPath))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "powershell.exe",
                        Arguments = string.Format("-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File \"{0}\"", scriptPath),
                        WorkingDirectory = appDir,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    try { Process.Start(psi); } catch { }
                }
            }

            // Wait up to 6 seconds for backend to answer
            for (int i = 0; i < 30; i++)
            {
                if (IsBackendRunning(48123)) break;
                Thread.Sleep(200);
            }

            // 2. Launch Dedicated Desktop Window via Edge App Mode
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            if (!File.Exists(edgePath))
            {
                edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
            }

            string targetUrl = "http://127.0.0.1:48123/";
            string userProfile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NetBoostPro", "WindowProfile");

            if (File.Exists(edgePath))
            {
                ProcessStartInfo edgePsi = new ProcessStartInfo
                {
                    FileName = edgePath,
                    Arguments = string.Format("--app=\"{0}\" --user-data-dir=\"{1}\" --window-size=1280,840 --app-id=\"com.netboostpro.app\"", targetUrl, userProfile),
                    UseShellExecute = true
                };
                try { Process.Start(edgePsi); } catch { Process.Start(targetUrl); }
            }
            else
            {
                // Fallback to standard browser launch
                Process.Start(targetUrl);
            }
        }

        static void ExtractEmbeddedPayload(string targetDirectory)
        {
            try
            {
                if (!Directory.Exists(targetDirectory)) Directory.CreateDirectory(targetDirectory);
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream stream = asm.GetManifestResourceStream("Payload"))
                {
                    if (stream != null)
                    {
                        using (ZipArchive archive = new ZipArchive(stream))
                        {
                            foreach (ZipArchiveEntry entry in archive.Entries)
                            {
                                string fullPath = Path.Combine(targetDirectory, entry.FullName);
                                if (string.IsNullOrEmpty(entry.Name))
                                {
                                    Directory.CreateDirectory(fullPath);
                                }
                                else
                                {
                                    string dir = Path.GetDirectoryName(fullPath);
                                    if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                                    entry.ExtractToFile(fullPath, true);
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        static bool IsBackendRunning(int port)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(string.Format("http://127.0.0.1:{0}/api/get_system_specs", port));
                req.Method = "POST";
                req.Timeout = 800;
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    return resp.StatusCode == HttpStatusCode.OK;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
