using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using DataContracts;
using Microsoft.ServiceFabric.Services.Remoting.FabricTransport.Runtime;
using static DataContracts.Class1;
using ServiceFabric.PubSubActors.PublisherServices;
using ServiceFabric.PubSubActors.Helpers;

namespace PublishingStatelessService
{
    
    internal sealed class PublishingStatelessService : StatelessService, IPublishingStatelessService
    {
        private readonly IPublisherServiceHelper _publisherServiceHelper;
        public PublishingStatelessService(StatelessServiceContext context)
            : base(context)
        {
            _publisherServiceHelper = new PublisherServiceHelper(new BrokerServiceLocator());
        }

        public async Task<string> PublishMessageOneAsync()
        {
            ServiceEventSource.Current.ServiceMessage(this.Context, "===> Publishing Message one in broker actor");
            await this.PublishMessageAsync(new PublishedMessageOne { Content = "Hello PubSub World, from Service!" });
            return "Message published tot broker actor";
        }

        public async Task<string> PublishMessageTwoAsync()
        {
            ServiceEventSource.Current.ServiceMessage(this.Context, "===> Publishing Message two in broker service");
            await this.PublishMessageToBrokerServiceAsync(new PublishedMessageTwo { Content = "Hello PubSub World, from Service, using Broker Service!" });
            //await this.PublishMessageAsync(new PublishedMessageOne { Content = "Hello PubSub World, from Service!" });
            return "Message published to broker service";
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            yield return new ServiceInstanceListener(context => new FabricTransportServiceRemotingListener(context, this), "StatelessFabricTransportServiceRemotingListener");
        }

      
    }
}
