using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceInterfaces.Model
{
    public class InfoModelUpdater
    {
        public string LocationId { set; get; }
        public string DiagramId { set; get; }
        public string TenantId { set; get; }
        public string TenantName { set; get; }
        public string DiagramName { set; get; }
        public string NodeType { set; get; }
        public string ModifiedBy { set; get; }
        public string ModifiedDataTime { set; get; }
        public string InfoJson { set; get; }
        public InfoModelUpdater() { }


    }
}
