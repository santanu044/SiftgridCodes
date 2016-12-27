﻿using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using ServiceFabric.PubSubActors;

namespace PubSubService
{
    
    internal sealed class PubSubService :  BrokerService
    {
        public PubSubService(StatefulServiceContext context)
            : base(context)
        {
            //optional: provide a logging callback
            ServiceEventSourceMessageCallback = message => ServiceEventSource.Current.ServiceMessage(this.Context, "**** logging callback in service:",message);
        }

    }
}
