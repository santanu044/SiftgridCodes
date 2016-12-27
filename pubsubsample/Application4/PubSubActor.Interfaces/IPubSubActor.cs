using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Actors;
using ServiceFabric.PubSubActors.Interfaces;

namespace PubSubActor.Interfaces
{
    
    public interface IPubSubActor : IBrokerActor
    {
        
    }
}
