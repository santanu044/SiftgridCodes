using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using VisualObjects.WebService;

namespace ServerStatelessService
{
   
    internal sealed class ServerStatelessService : StatelessService
    {
        public ServerStatelessService(StatelessServiceContext context)
            : base(context)
        { }

       
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new[]
            {
                new ServiceInstanceListener(
                    initparams => new WebSocketApp("websocketserver", "data", initparams),
                    "webSocketListener")
            };
        }

       
        //protected override async Task RunAsync(CancellationToken cancellationToken)
        //{
            
        //    long iterations = 0;

        //    while (true)
        //    {
        //        cancellationToken.ThrowIfCancellationRequested();

        //        ServiceEventSource.Current.ServiceMessage(this.Context, "Working-{0}", ++iterations);

        //        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
        //    }
        //}
    }
}
