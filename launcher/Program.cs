using System;
using System.Diagnostics;
using System.IO;
using System.Net;
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
                    Process.Start(psi);
                }
            }

            // Wait up to 5 seconds for backend to answer
            for (int i = 0; i < 25; i++)
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
                Process.Start(edgePsi);
            }
            else
            {
                // Fallback to standard browser launch
                Process.Start(targetUrl);
            }
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
