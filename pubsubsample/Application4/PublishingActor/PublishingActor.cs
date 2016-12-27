using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Actors;
using Microsoft.ServiceFabric.Actors.Runtime;
using Microsoft.ServiceFabric.Actors.Client;
using PublishingActor.Interfaces;
using ServiceFabric.PubSubActors.Helpers;
using ServiceFabric.PubSubActors.PublisherActors;
using static DataContracts.Class1;

namespace PublishingActor
{
    
    [StatePersistence(StatePersistence.None)]
    internal class PublishingActor : Actor, IPublishingActor
    {
        private readonly IPublisherActorHelper _publisherActorHelper;
        public PublishingActor(ActorService actorService, ActorId actorId)
            : base(actorService, actorId)
        {
            _publisherActorHelper = new PublisherActorHelper(new BrokerServiceLocator());
        }

        public async Task<string> PublishMessageOneAsync()
        {
            ActorEventSource.Current.ActorMessage(this, "===> Publishing Message one in Broker actor from actor");
            //using broker actor
            await this.PublishMessageAsync(new PublishedMessageOne { Content = "Hello PubSub World, from Actor, using Broker Actor!" });

            return "Message published to broker actor";
        }

        public async Task<string> PublishMessageTwoAsync()
        {
            ActorEventSource.Current.ActorMessage(this, "===> Publishing Message two in broker service");
            //using broker service
            //await _publisherActorHelper.PublishMessageAsync(this, new PublishedMessageTwo { Content = "Hello PubSub World, from Actor, using Broker Service!" });
            await this.PublishMessageToBrokerServiceAsync(new PublishedMessageTwo { Content = "Hello PubSub World, from Service, using Broker Service!" });

            return "Message published to broker service";
        }

    }
}
