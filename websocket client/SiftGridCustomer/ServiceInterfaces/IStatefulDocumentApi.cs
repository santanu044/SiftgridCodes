using Microsoft.ServiceFabric.Services.Remoting;
using NJsonSchema;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceInterfaces
{
    public interface IStatefulDocumentApi : IService
    {

        Task<string> GenerateHtmlFormSchema(Dictionary<string, JsonSchema4> schemaList, string tenantName, string tenantId, string objName);

        Task<String> GetLocationObjectFromSchema(String nodetype, String tenantName, String tenantId);

        Task<String> GetSQLConnectionString(String tenantName, String tenantId);
        Task<String> GetSQLConnectionStringForObjectSearch(String secretkey);
        Task<String> GetDocumentDBEndPoint(String tenantName, string tenantId);
        Task<String> GetDocumentDBPrimaryKey(String tenantName, String tenantId);

        Task<String> GetDocumentDBSectretValues(String secretkey);

        Task<String> GetTenantId(String tenantName);
    }
}
