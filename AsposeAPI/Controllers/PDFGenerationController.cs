using AsposeAPI.Business;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AsposeAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PDFGenerationController : ControllerBase
    {
        private readonly IGeneratePDF _generatePDF;

        public PDFGenerationController(IGeneratePDF generatePDF)
        {
            _generatePDF = generatePDF;
        }

        [HttpPost]
        public Task<string> CreatePDF()
        {
            IEnumerable<FileInfo> files = _generatePDF.GetDocFiles();
            try
            {
                if (files.Count() > 0)
                {
                    Stopwatch stopWatch = new Stopwatch();
                    stopWatch.Start();
                    Task<string> _message = _generatePDF.GeneratePDFFiles(files);
                    stopWatch.Stop();
                    return Task.FromResult($"{_message.Result} And Time Taken Is {stopWatch.Elapsed.TotalSeconds}");
                }
                else
                    return Task.FromResult("No Files to Process");
            }
            catch (Exception ex)
            {
               return Task.FromResult(Task.FromException(ex).Exception.Message);
            }
        }

        [HttpPost]
        public async Task<string> CreatePDFWithClients(int NoofClients)
        {
            IEnumerable<FileInfo> files = _generatePDF.GetDocFiles();
            try
            {
                if (files.Count() > 0)
                {
                    Stopwatch stopWatch = new Stopwatch();
                    stopWatch.Start();
                    List<Task<string>> tasks = new List<Task<string>>();
                    for (int i = 0; i < NoofClients; i++)
                    {
                        tasks.Add(_generatePDF.GeneratePDFFiles(files));
                    }
                    _ = await Task.WhenAll(tasks);
                    stopWatch.Stop();
                    return await Task.FromResult($"Time Taken Is {stopWatch.Elapsed.TotalSeconds}");
                }
                else
                    return await Task.FromResult("No Files to Process");
            }
            catch (Exception ex)
            {
                return await Task.FromResult(Task.FromException(ex).Exception.Message);
            }
        }
    }
}
