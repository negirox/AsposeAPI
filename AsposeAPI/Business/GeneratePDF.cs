using Aspose.Words.Saving;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Document = Aspose.Words.Document;
using PdfSaveOptions = Aspose.Words.Saving.PdfSaveOptions;

namespace AsposeAPI.Business
{
    public class GeneratePDF : IGeneratePDF
    {
        private static readonly string baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
        readonly Aspose.Words.License license;
        public GeneratePDF()
        {
            license = new Aspose.Words.License();
            ApplyLicense();
        }

        private void ApplyLicense()
        {
            try
            {
                string path = $"{baseDirectory}\\license";
                CreateDirectory(path);
                license.SetLicense($"{path}\\Aspose.Words.NET.lic");
                Console.WriteLine("License set successfully.");
            }
            catch (Exception e)
            {
                Console.WriteLine("\nThere was an error setting the license: " + e.Message);
            }
        }

        public Task<string> GeneratePDFFiles(IEnumerable<FileInfo> files)
        {
            Document originalDoc;
            string path = $"{baseDirectory}\\output";
            try
            {
                CreateDirectory(path);
                PdfSaveOptions pso = new PdfSaveOptions
                {
                    Compliance = PdfCompliance.Pdf17
                };
                foreach (FileInfo item in files)
                {
                    originalDoc = new Document(item.FullName);
                    string fileSavepath = $"{path}\\{Guid.NewGuid()}.pdf";
                    originalDoc.Save(fileSavepath, pso);
                }
            }
            catch (Exception ex)
            {

                return Task.FromResult(Task.FromException(ex).Exception.Message);
            }
            return Task.FromResult("Files Converted Successfully.");
        }

        private static void CreateDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public IEnumerable<FileInfo> GetDocFiles()
        {
            return GetFilesFromDirectory();
        }

        private IEnumerable<FileInfo> GetFilesFromDirectory()
        {
            IEnumerable<FileInfo> files;
            try
            {
                string path = $"{baseDirectory}\\FilestoProcess";
                CreateDirectory(path);
                DirectoryInfo d = new DirectoryInfo(path);

                FileInfo[] docFiles = d.GetFiles("*.doc");
                FileInfo[] docxFiles = d.GetFiles("*.docx");
                List<FileInfo> filesInfos = new List<FileInfo>();
                filesInfos.AddRange(docFiles);
                filesInfos.AddRange(docxFiles);
                files = filesInfos.AsEnumerable();
                return files;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
