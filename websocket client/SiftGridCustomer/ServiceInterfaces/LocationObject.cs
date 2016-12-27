using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceInterfaces.Model
{
    public class LocationObject
    {
        public String LocationId { set; get; }
        public String NodeType { set; get; }
        public String UWI { set; get; }

        public String TenantId { set; get; }

        public String TenantName { set; get; }
        public String DiagramId { set; get; }

        public String DiagramName { set; get; }

        public String CreatedBy { set; get; }
        public String ModifiedBy { set; get; }

        public String CreatedDateTime { set; get; }
        public String ModifiedDataTime { set; get; }
        public String XCoordinate { set; get; }
        public String YCoordinate { set; get; }

        public LocationObject() { }
    }
}
