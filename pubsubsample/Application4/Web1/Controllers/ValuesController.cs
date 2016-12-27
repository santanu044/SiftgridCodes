using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using DataContracts;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Actors;
using Microsoft.ServiceFabric.Actors.Client;
using PublishingActor.Interfaces;
using SubscribingActor.Interfaces;

namespace Web1.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        
        [HttpGet]
        public async Task<String> Get()
        {
            IPublishingActor pubActor = ActorProxy.Create<IPublishingActor>(ActorId.CreateRandom(), "fabric:/Application4");

            //IPublishingStatelessService pub = ServiceProxy.Create<IPublishingStatelessService>(new Uri(uriString: "fabric:/Application4/PublishingStatelessService"));

            string output = null;
            try
            {
                //For publish message from Service.
                //output = await pub.PublishMessageTwoAsync();

                //For publish message from Actor.
                output = await pubActor.PublishMessageOneAsync();
            }
            catch (Exception e)
            {
                output = e.Message;
            }

            return output;

        }


        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
