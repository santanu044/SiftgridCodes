using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using ServiceFabric.PubSubActors.Interfaces;
using ServiceFabric.PubSubActors.SubscriberServices;
using Microsoft.ServiceFabric.Data;
using static DataContracts.Class1;
using ServiceFabric.PubSubActors.Helpers;

namespace SubscribingStatefulService
{
    
    internal sealed class SubscribingStatefulService : StatefulService, ISubscriberService
    {
        private readonly ISubscriberServiceHelper _subscriberServiceHelper;

        public SubscribingStatefulService(StatefulServiceContext context)
            : base(context){

            _subscriberServiceHelper = new SubscriberServiceHelper(new BrokerServiceLocator());
        }

        public SubscribingStatefulService(StatefulServiceContext serviceContext, IReliableStateManagerReplica reliableStateManagerReplica) : base(serviceContext, reliableStateManagerReplica)
        {
            _subscriberServiceHelper = new SubscriberServiceHelper(new BrokerServiceLocator());
        }

        protected override Task OnOpenAsync(ReplicaOpenMode openMode, CancellationToken cancellationToken)
        {
            return RegisterAsync();
        }

        public async Task RegisterAsync()
        {
            //register with BrokerActor:    
            //await this.RegisterMessageTypeAsync(typeof(PublishedMessageOne));
            //register with BrokerService:
            await this.RegisterMessageTypeWithBrokerServiceAsync(typeof(PublishedMessageTwo));
        }

        public async Task UnregisterAsync()
        {
            //unregister with BrokerActor:  
            //await this.UnregisterMessageTypeAsync(typeof(PublishedMessageOne), true);
            //unregister with BrokerService:
            await this.UnregisterMessageTypeWithBrokerServiceAsync(typeof(PublishedMessageTwo), true);
        }


        //receives published messages.
        public Task ReceiveMessageAsync(MessageWrapper message)
        {
            var payload = this.Deserialize<PublishedMessageOne>(message);
            ServiceEventSource.Current.ServiceMessage(this.Context, $"====> Received message in service: {payload.Content}");
            //TODO: handle message
            return Task.FromResult(true);
        }

        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
        {
            yield return new ServiceReplicaListener(p => new SubscriberCommunicationListener(this, p), "StatefulSubscriberCommunicationListener");
        }

        
        //protected override async Task RunAsync(CancellationToken cancellationToken)
        //{
           

        //    var myDictionary = await this.StateManager.GetOrAddAsync<IReliableDictionary<string, long>>("myDictionary");

        //    while (true)
        //    {
        //        cancellationToken.ThrowIfCancellationRequested();

        //        using (var tx = this.StateManager.CreateTransaction())
        //        {
        //            var result = await myDictionary.TryGetValueAsync(tx, "Counter");

        //            ServiceEventSource.Current.ServiceMessage(this.Context, "Current Counter Value: {0}",
        //                result.HasValue ? result.Value.ToString() : "Value does not exist.");

        //            await myDictionary.AddOrUpdateAsync(tx, "Counter", 0, (key, value) => ++value);

        //            // If an exception is thrown before calling CommitAsync, the transaction aborts, all changes are 
        //            // discarded, and nothing is saved to the secondary replicas.
        //            await tx.CommitAsync();
        //        }

        //        await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
        //    }
        //}
    }
}
