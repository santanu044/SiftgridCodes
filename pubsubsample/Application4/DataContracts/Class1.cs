using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace DataContracts
{
    public class Class1
    {
        [DataContract]
        public class PublishedMessageOne
        {
            [DataMember]
            public string Content { get; set; }
        }
        [DataContract]
        public class PublishedMessageTwo
        {
            [DataMember]
            public string Content { get; set; }
        }
    }
}
