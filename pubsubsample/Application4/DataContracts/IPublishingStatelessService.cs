using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataContracts
{
    //[ServiceContract]
    public interface IPublishingStatelessService : IService
    {
        //[OperationContract]
        Task<string> PublishMessageOneAsync();
        //[OperationContract]
        Task<string> PublishMessageTwoAsync();
    }
}
