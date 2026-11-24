using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Windows.Forms;

namespace NetBoostProInstaller
{
    public class InstallerForm : Form
    {
        private ProgressBar progressBar;
        private Label statusLabel;
        private Button installButton;
        private CheckBox launchCheckBox;

        public InstallerForm()
        {
            this.Text = "NetBoost Pro - Universal Windows 11 Installer";
            this.Size = new Size(540, 360);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(11, 15, 25);
            this.ForeColor = Color.White;

            Label titleLabel = new Label
            {
                Text = "Install NetBoost Pro v1.0",
                Font = new Font("Segoe UI", 16, FontStyle.Bold),
                ForeColor = Color.FromArgb(0, 229, 255),
                Location = new Point(30, 25),
                AutoSize = true
            };
            this.Controls.Add(titleLabel);

            Label descLabel = new Label
            {
                Text = "Advanced Universal Windows 11 Internet & Gaming Optimizer.\nInstalls for current user with zero administrator prompt required.",
                Font = new Font("Segoe UI", 9),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(32, 65),
                Size = new Size(460, 40)
            };
            this.Controls.Add(descLabel);

            statusLabel = new Label
            {
                Text = "Ready to install to: %LocalAppData%\\Programs\\NetBoostPro",
                Font = new Font("Segoe UI", 9),
                ForeColor = Color.FromArgb(203, 213, 225),
                Location = new Point(32, 130),
                Size = new Size(460, 30)
            };
            this.Controls.Add(statusLabel);

            progressBar = new ProgressBar
            {
                Location = new Point(32, 170),
                Size = new Size(460, 22),
                Minimum = 0,
                Maximum = 100,
                Value = 0
            };
            this.Controls.Add(progressBar);

            launchCheckBox = new CheckBox
            {
                Text = "Launch NetBoost Pro immediately after setup",
                Checked = true,
                ForeColor = Color.FromArgb(226, 232, 240),
                Font = new Font("Segoe UI", 9),
                Location = new Point(32, 215),
                AutoSize = true
            };
            this.Controls.Add(launchCheckBox);

            installButton = new Button
            {
                Text = "Install Now",
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                BackColor = Color.FromArgb(0, 229, 255),
                ForeColor = Color.FromArgb(7, 9, 14),
                FlatStyle = FlatStyle.Flat,
                Location = new Point(350, 260),
                Size = new Size(140, 38),
                Cursor = Cursors.Hand
            };
            installButton.FlatAppearance.BorderSize = 0;
            installButton.Click += InstallButton_Click;
            this.Controls.Add(installButton);
        }

        private void InstallButton_Click(object sender, EventArgs e)
        {
            installButton.Enabled = false;
            progressBar.Value = 15;
            statusLabel.Text = "Creating installation directories...";

            try
            {
                string sourceDir = AppDomain.CurrentDomain.BaseDirectory;
                string targetDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "NetBoostPro");

                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }

                progressBar.Value = 35;
                statusLabel.Text = "Deploying core application binaries...";

                Assembly asm = Assembly.GetExecutingAssembly();
                string installedExe = Path.Combine(targetDir, "NetBoostPro.exe");

                // 1. Extract Launcher executable (from embedded resource or fallback to source folder)
                bool launcherExtracted = false;
                using (Stream s = asm.GetManifestResourceStream("Launcher"))
                {
                    if (s != null)
                    {
                        using (FileStream fs = new FileStream(installedExe, FileMode.Create, FileAccess.Write))
                        {
                            s.CopyTo(fs);
                        }
                        launcherExtracted = true;
                    }
                }
                if (!launcherExtracted)
                {
                    string localExe = Path.Combine(sourceDir, "NetBoostPro.exe");
                    if (File.Exists(localExe)) File.Copy(localExe, installedExe, true);
                }

                progressBar.Value = 65;
                statusLabel.Text = "Extracting frontend and backend engine...";

                // 2. Extract Payload archive (scripts + dist) from embedded resource or fallback
                bool payloadExtracted = false;
                using (Stream s = asm.GetManifestResourceStream("Payload"))
                {
                    if (s != null)
                    {
                        using (ZipArchive archive = new ZipArchive(s))
                        {
                            foreach (ZipArchiveEntry entry in archive.Entries)
                            {
                                string fullPath = Path.Combine(targetDir, entry.FullName);
                                if (string.IsNullOrEmpty(entry.Name))
                                {
                                    Directory.CreateDirectory(fullPath);
                                }
                                else
                                {
                                    string p = Path.GetDirectoryName(fullPath);
                                    if (!Directory.Exists(p)) Directory.CreateDirectory(p);
                                    entry.ExtractToFile(fullPath, true);
                                }
                            }
                        }
                        payloadExtracted = true;
                    }
                }
                if (!payloadExtracted)
                {
                    string localScripts = Path.Combine(sourceDir, "scripts");
                    if (Directory.Exists(localScripts)) CopyDirectory(localScripts, Path.Combine(targetDir, "scripts"));
                    string localDist = Path.Combine(sourceDir, "dist");
                    if (Directory.Exists(localDist)) CopyDirectory(localDist, Path.Combine(targetDir, "dist"));
                }

                progressBar.Value = 85;
                statusLabel.Text = "Creating Desktop and Start Menu shortcuts...";

                CreateShortcut(installedExe, Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "NetBoost Pro.lnk"));
                
                string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
                CreateShortcut(installedExe, Path.Combine(startMenu, "NetBoost Pro.lnk"));

                progressBar.Value = 100;
                statusLabel.Text = "Installation complete!";
                installButton.Text = "Close";
                installButton.Enabled = true;
                installButton.Click -= InstallButton_Click;
                installButton.Click += (s, args) => this.Close();

                if (launchCheckBox.Checked && File.Exists(installedExe))
                {
                    Process.Start(installedExe);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Installation error: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                statusLabel.Text = "Installation encountered an issue.";
                installButton.Enabled = true;
            }
        }

        private static void CopyDirectory(string sourceDir, string destinationDir)
        {
            var dir = new DirectoryInfo(sourceDir);
            if (!dir.Exists) return;

            DirectoryInfo[] dirs = dir.GetDirectories();
            Directory.CreateDirectory(destinationDir);

            foreach (FileInfo file in dir.GetFiles())
            {
                string targetFilePath = Path.Combine(destinationDir, file.Name);
                file.CopyTo(targetFilePath, true);
            }

            foreach (DirectoryInfo subDir in dirs)
            {
                string newDestinationDir = Path.Combine(destinationDir, subDir.Name);
                CopyDirectory(subDir.FullName, newDestinationDir);
            }
        }

        private static void CreateShortcut(string targetExe, string shortcutPath)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = targetExe;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(targetExe);
                    shortcut.Description = "NetBoost Pro - Universal Windows 11 Internet Optimizer";
                    shortcut.Save();
                }
            }
            catch { }
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }
}
