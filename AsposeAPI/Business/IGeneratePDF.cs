using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AsposeAPI.Business
{
    public interface IGeneratePDF
    {
        IEnumerable<FileInfo> GetDocFiles();
        Task<string> GeneratePDFFiles(IEnumerable<FileInfo> files);
    }
}
