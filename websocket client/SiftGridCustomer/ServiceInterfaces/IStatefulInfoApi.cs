using Microsoft.ServiceFabric.Services.Remoting;
using ServiceInterfaces.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceIntefaces
{
    public interface IStatefulInfoApi : IService
    {
        //Task<String> CreateInfo(String locationID, String nodeType,String tenantName, String tenantId);

        Task<String> GetInfo(String locationID, String nodeType, String tenantName, String tenantId);
        //Task<String> UpdateObjectProperty(String objectProps, String tenantName, String tenantId);
        Task<String> GetInfoForTimeMachine(String locationID, String nodeType, String tenantName, String tenantId, String datetime);

        Task<String> CreateLocationObject(LocationObject locationObject);

        Task<String> GetLocationObject(LocationObject locationObject);

        Task<String> UpdateObjectProperties(InfoModelUpdater infoModel);

        Task<String> DeleteLocationObject(String locationId, String tenantName, String tenantId);

        Task<String> GetLocationObjectFromSchema(String nodetype, String tenantName, String tenantId);
    }
}
