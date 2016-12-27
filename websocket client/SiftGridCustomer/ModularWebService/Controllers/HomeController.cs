using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Client;

using Newtonsoft.Json;

using Newtonsoft.Json.Linq;
using ServiceIntefaces;
using ServiceInterfaces;
using NotesApi.Model;
using System.Diagnostics;
using ModularWebservice.Model;
using ModularWebservice.Controllers;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.ApplicationInsights;
using ServiceInterfaces.Model;

namespace ModularWebService.Controllers
{
    public class HomeController : Controller
    {
        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<String> CreateOrInsertDiagramJson([FromBody]InputData diagramData)
        {
            String output = null;
            TelemetryClient tc = new TelemetryClient();
         
            IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
            new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
            new ServicePartitionKey(0));
            try
            {
                output = await info.GetFromDatabaseWithTenantId(diagramData.data, diagramData.tenantName);
                tc.TrackRequest("Track CreateOrInsertDiagramJson Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("CreateOrInsertDiagramJson Metric", 100);
                tc.TrackEvent("Tracked Event CreateOrInsertDiagramJson");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
        }

        
        [HttpGet]
        public async Task<bool> passwordValidate(string email, string password)
        {
            string AzureADSTSURL = "https://login.windows.net/{0}/oauth2/token?api-version=1.0";
            //string GraphPrincipalId = "https://graph.windows.net";
            string GraphPrincipalId = "https://graph.microsoft.com/";

            //  var userid = email;

            string tenantId = "108fcad1-26f8-4813-a899-fcc51e11e250";   //  webapi
            string clientId = "c9ad927c-4390-4642-8b26-1ed7f670c259";
            // string clientId = "ba1c6ed5-9779-46a7-ac42-7ddcc5c878d2";
            string clientSecret = "On7SZqUA4/eK1vkxFLTMUOEsBZMQEiawTz6gEreoSSI=";
            string authString = String.Format(AzureADSTSURL, tenantId);

            var context = new AuthenticationContext(authString);
            var credentials = new UserPasswordCredential(email, password);


            // UserPasswordCredential userCredentials = new UserPasswordCredential(userid, password);
            // AuthenticationResult authenticationResult = null;
            bool validUser = false;

            try
            {
                // authenticationResult = await context.AcquireTokenAsync(GraphPrincipalId.ToString(), clientId, userCredentials); // this works only if the clientId corresponds to a native app
                var authResult =await context.AcquireTokenAsync(GraphPrincipalId.ToString(), clientId, credentials);

                var x = authResult.UserInfo.IdentityProvider;
                validUser = true;
            }

            catch (Exception e)
            {

                Console.WriteLine(e.Message);
                //Console.WriteLine(authenticationResult.UserInfo);
              //  validUser = false;
            }
            return validUser;
        }



        //[HttpPost]
        //public async Task<String> CreateObjectInfo([FromBody]LocationApi location)
        //{
        //    TelemetryClient tc = new TelemetryClient();
        //    String output = null;
        //    IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
        //                    new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
        //                    new ServicePartitionKey(0));
        //    try
        //    {
        //        output = await info.CreateInfo(location.LocationId, location.NodeType, location.tenantName, location.tenantId);
        //        tc.TrackRequest("Track CreateObjectInfo Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
        //        tc.TrackMetric("CreateObjectInfo Metric", 100);
        //        tc.TrackEvent("Tracked Event CreateObjectInfo");
        //    }
        //    catch (Exception ex)
        //    {
        //        tc.TrackException(ex);
        //    }
        //   tc.Flush();
        //    return output;

        //}

        [HttpPost]
        public async Task<String> CreateLocationObject([FromBody]LocationObject locationObject)
        {
            IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
                         new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                         new ServicePartitionKey(0));

            String output = await info.CreateLocationObject(locationObject);

            return output;

        }

        [HttpPut]
        public async Task<String> UpdateObjectProperties([FromBody]InfoModelUpdater infoModel)
        {
            Trace.WriteLine("---------------------------");
            Trace.WriteLine("Started" + DateTime.Now.ToString("h:mm:ss tt"));
            IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
                       new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                       new ServicePartitionKey(0));

            IStatefullErrorApi getinfoDocDB = ServiceProxy.Create<IStatefullErrorApi>(
                            new Uri(uriString: "fabric:/ErrorApp/ErrorApi"),
                            new ServicePartitionKey(0));

            JObject json = JObject.Parse(infoModel.InfoJson);
            string Typedoc =
                await getinfoDocDB.GetObjectDocument(infoModel.NodeType, infoModel.TenantName, infoModel.TenantId);

            Trace.WriteLine("Getting error info" + DateTime.Now.ToString("h:mm:ss tt"));
            dynamic jsondoc = JsonConvert.DeserializeObject(Typedoc);
            if (jsondoc != null)
            {
                foreach (var docobj in jsondoc)
                {
                    foreach (var js in json)
                    {
                        string key = docobj["Name"];
                        if (js.Key.Equals(key))
                        {
                            if (!(js.Value.ToString().Equals("")))
                            {
                                json["IsMissingField"] = "false";

                            }
                            if ((js.Value.ToString().Equals("")))
                            {

                                json["IsMissingField"] = "true";

                            }
                        }

                    }
                }
            }
            Trace.WriteLine("Updating to database response" + DateTime.Now.ToString("h:mm:ss tt"));

            String response = await info.UpdateObjectProperties(infoModel);
            Trace.WriteLine("Returning response" + DateTime.Now.ToString("h:mm:ss tt"));

            return response;

        }

        public async Task<String> GetLocationObject(String nodeInfo)
        {
            LocationObject locationObject = JsonConvert.DeserializeObject<LocationObject>(nodeInfo);
            IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
                        new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                        new ServicePartitionKey(0));

            String output = await info.GetLocationObject(locationObject);

            return output;

        }

        [HttpDelete]
        public async Task<String> DeleteLocationObject(String locationId, String tenantName, String tenantId)
        {
            IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
                      new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                      new ServicePartitionKey(0));
            String status = await info.DeleteLocationObject(locationId, tenantName, tenantId);
            return status;

        }



        [HttpGet]
        public async Task<String> GetInfo(String nodeInfo)
        {
            var tc = new TelemetryClient();
            String output = null;
            try
            {
                NodeInfo node = JsonConvert.DeserializeObject<NodeInfo>(nodeInfo);
                IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
                                new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                                new ServicePartitionKey(0));

                output = await info.GetInfo(node.LocationId, node.NodeType, node.tenantName, node.tenantId);
                tc.TrackRequest("Track GetInfo Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetInfo Metric", 100);
                tc.TrackEvent("Tracked Event GetInfo");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;

        }

        [HttpGet]
        public async Task<String> GetDiagramInfo(String diagramName, String diagramId, String tenantName, String tenantId)
        {
            var tc = new TelemetryClient();
            String response = null;
            IStatefulDiagramApi diagram = ServiceProxy.Create<IStatefulDiagramApi>(
                       new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
                       new ServicePartitionKey(0));
            try
            {
                response = await diagram.GetDiagramProperties(diagramName, diagramId, tenantName, tenantId);
                tc.TrackRequest("Track GetDiagramInfo Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetDiagramInfo Metric", 100);
                tc.TrackEvent("Tracked Event GetDiagramInfo");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;

        }
        [HttpGet]
        //public async Task<String> GetDiagramJson(String diagramId)
        //{

        //    IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
        //               new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
        //               new ServicePartitionKey(0));
        //    String output = await info.getFromDatabase(diagramId);

        //    return output;
        //}

        [HttpPut]
        public async Task<String> Put([FromBody]Diagram diagram)
        {
            var tc = new TelemetryClient();
            String response = null;
            IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
                       new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
                       new ServicePartitionKey(0));
            try
            {
                response = await info.updateDiagram(diagram.GUID, diagram.DiagramJson);
                tc.TrackRequest("Track Put Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("Put Metric", 100);
                tc.TrackEvent("Tracked Event Put");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();            
            return response;
        }
        [HttpPut]
        public async Task<String> UpdateAreaDiagramJson([FromBody]InputData diagramData)
        {
            IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
                    new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
                    new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await info.updateAreaDiagramJson(diagramData.data, diagramData.tenantName);
                tc.TrackRequest("Track UpdateAreaDiagramJson Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("UpdateAreaDiagramJson Metric", 100);
                tc.TrackEvent("Tracked Event UpdateAreaDiagramJson");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }
        public async Task<String> PutArea([FromBody] Diagram diagram)
        {

            IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
                     new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
                     new ServicePartitionKey(0));
            String response = null;
            var tc = new TelemetryClient();
            try
            {
                response = await info.updateAreaDiagram(diagram.GUID, diagram.DiagramJson);
                tc.TrackRequest("Track PutArea Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("PutArea Metric", 100);
                tc.TrackEvent("Tracked Event PutArea");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }


        //[HttpPut]
        //public async Task<String> UpdateObjectProps([FromBody]String objProps)
        //{
        //    Trace.WriteLine("---------------------------");
        //    Trace.WriteLine("Started" + DateTime.Now.ToString("h:mm:ss tt"));
        //    IStatefulInfoApi info = ServiceProxy.Create<IStatefulInfoApi>(
        //               new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
        //               new ServicePartitionKey(0));

        //    IStatefullErrorApi getinfoDocDB = ServiceProxy.Create<IStatefullErrorApi>(
        //                    new Uri(uriString: "fabric:/ErrorApp/ErrorApi"),
        //                    new ServicePartitionKey(0));
        //    var tc = new TelemetryClient();
        //    JObject inputData = JObject.Parse(objProps);

        //    JObject json = JObject.Parse(inputData["data"].ToString());
        //    string Typedoc = 
        //        await getinfoDocDB.GetObjectDocument(json["NodeType"].ToString(),inputData["tenantName"].ToString(), inputData["tenantId"].ToString());

        //    Trace.Write("Getting error info" + DateTime.Now.ToString("h:mm:ss tt"));
        //    dynamic jsondoc = JsonConvert.DeserializeObject(Typedoc);
        //    if (jsondoc != null)
        //    {
        //        foreach (var docobj in jsondoc)
        //        {
        //            foreach (var js in json)
        //            {
        //                string key = docobj["Name"];
        //                if (js.Key.Equals(key))
        //                {
        //                    if (!(js.Value.ToString().Equals("")))
        //                    {
        //                        json["IsMissingField"] = "false";

        //                    }
        //                    if ((js.Value.ToString().Equals("")))
        //                    {

        //                        json["IsMissingField"] = "true";

        //                    }
        //                }

        //            }
        //        }
        //    }
        //    Trace.WriteLine("Updating to database response" + DateTime.Now.ToString("h:mm:ss tt"));

        //    String response = await info.UpdateObjectProperty(json.ToString(), inputData["tenantName"].ToString(), inputData["tenantId"].ToString());
        //    Trace.WriteLine("Returning response" + DateTime.Now.ToString("h:mm:ss tt"));

        //    return response;
        //}

        [HttpGet]
        public async Task<string> GetDocument(String diagramId,String tenantName, String tenantID)
        {
            IStatefullErrorApi getinfoDocDB = ServiceProxy.Create<IStatefullErrorApi>(
                     new Uri(uriString: "fabric:/ErrorApp/ErrorApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            List<ErrorList> errorlist = new List<ErrorList>();
            string json = null;
            try
            {
                errorlist = await getinfoDocDB.GetErrorList(diagramId, tenantName, tenantID);
                tc.TrackRequest("Track GetDocument Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetDocument Metric", 100);
                tc.TrackEvent("Tracked Event GetDocument");
                json = JsonConvert.SerializeObject(errorlist);
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }           
            tc.Flush();
            return json;
        }

        //Notes Operation
        [HttpPost]
        public async Task<List<Noteslist>> saveNotes([FromBody]Notes note)
        {
            IStatefulNotesApi noteinfo = ServiceProxy.Create<IStatefulNotesApi>(
                            new Uri(uriString: "fabric:/NotesApp/NotesApi"),
                            new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            List<Noteslist> list = new List<Noteslist>();
            try
            {
                list = await noteinfo.saveNote(note.DiagramId, note.LocationId, note.NoteId,
                    note.CreatedDateTime, note.NoteJson, note.TenantName, note.TenantId);
                tc.TrackRequest("Track saveNotes Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("saveNotes Metric", 100);
                tc.TrackEvent("Tracked Event saveNotes");               
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return list;

        }
  
        [HttpPut]
        public async Task<List<Noteslist>> deleteNote(string noteId,string locationid, string tenantName,String tenantId)
        {
            IStatefulNotesApi noteinfo = ServiceProxy.Create<IStatefulNotesApi>(
                            new Uri(uriString: "fabric:/NotesApp/NotesApi"),
                            new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            List<Noteslist> list = new List<Noteslist>();
            try
            {
                list = await noteinfo.deleteNote(noteId,locationid, tenantName, tenantId);
                tc.TrackRequest("Track deleteNote Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("deleteNote Metric", 100);
                tc.TrackEvent("Tracked Event deleteNote");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return list;
        }


        [HttpGet]
        public async Task<List<Noteslist>> getNotesInfo(String locationId,String tenantName, String tenantId)
        {
            var tc = new TelemetryClient();
            IStatefulNotesApi noteinfo = ServiceProxy.Create<IStatefulNotesApi>(
                            new Uri(uriString: "fabric:/NotesApp/NotesApi"),
                            new ServicePartitionKey(0));
            List<Noteslist> output = new List<Noteslist>();
            try
            {
                output = await noteinfo.getNotes(locationId, tenantName, tenantId);
                tc.TrackRequest("Track getNotesInfo Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("getNotesInfo Metric", 100);
                tc.TrackEvent("Tracked Event getNotesInfo");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
        }

        [HttpPut]
        public async Task<List<Noteslist>> updateNote([FromBody]UpdateNotes note)
        {
            var tc = new TelemetryClient();
            IStatefulNotesApi noteinfo = ServiceProxy.Create<IStatefulNotesApi>(
                           new Uri(uriString: "fabric:/NotesApp/NotesApi"),
                           new ServicePartitionKey(0));
            List<Noteslist> output = new List<Noteslist>();
            try
            {
                output = await noteinfo.updateNote(note.NoteId, note.DiagramId,
                    note.LocationId, note.ModifiedDateTime, note.NoteJson, note.TenantName, note.TenantId);
                tc.TrackRequest("Track updateNote Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("updateNote Metric", 100);
                tc.TrackEvent("Tracked Event updateNote");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;


        }



        //GET api/values/5
        [HttpGet]
        public async Task<IActionResult> GetPeopleById(string id,string tenantName)
        {
            var tc = new TelemetryClient();
            People people = new People();
            try
            {
                IStatefullPeopleApi iuser = ServiceProxy.Create<IStatefullPeopleApi>(new Uri(uriString: "fabric:/PeopleApp/PeopleApi"), new ServicePartitionKey(0));
                people = await iuser.getPeopleByID(id, tenantName);
                tc.TrackRequest("Track GetPeopleById Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetPeopleById Metric", 100);
                tc.TrackEvent("Tracked Event GetPeopleById");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            if (people == null)
                {
                    return NotFound();
                }
                else
                {
                    return new ObjectResult(people);
                }
             
        }


        [HttpPut]
        public async Task<String> PutPeople([FromBody]People people)
        {
            IStatefullPeopleApi iuser = ServiceProxy.Create<IStatefullPeopleApi>(new Uri(uriString: "fabric:/PeopleApp/PeopleApi"), new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await iuser.putPeopleAll(people.Guid, people.jsonData, people.tenantName, people.tenantId);
                tc.TrackRequest("Track PutPeople Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("PutPeople Metric", 100);
                tc.TrackEvent("Tracked Event PutPeople");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }


        // Object Search Api Search and Typehead
        [HttpGet]
        public async Task<string> GetSearchDocument(string search,string secretKey)
        {

            IStatefulSearchApi searchobj = ServiceProxy.Create<IStatefulSearchApi>(
                  new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                  new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            string output = null;
            try
            {
                output = await searchobj.GetlistDocument(search, secretKey);
                tc.TrackRequest("Track GetSearchDocument Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetSearchDocument Metric", 100);
                tc.TrackEvent("Tracked Event GetSearchDocument");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
        }

        [HttpGet]
        public async Task<string> GetSearchDetails(string item, string secretkey)
        {
            IStatefulSearchApi searchobj = ServiceProxy.Create<IStatefulSearchApi>(
                  new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                  new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            string output = null;
            try
            {
                output = await searchobj.GetSearchRecord(item, secretkey);
                tc.TrackRequest("Track GetSearchDetails Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetSearchDetails Metric", 100);
                tc.TrackEvent("Tracked Event GetSearchDetails");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
        }


        //Object Search API Areas

        [HttpPost]
        public async Task<String> InsertAreaDocObject([FromBody] SearchDetails searchobj)
        {

            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.SetAreaObjectDocument(searchobj);
                tc.TrackRequest("Track InsertAreaDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("InsertAreaDocObject Metric", 100);
                tc.TrackEvent("Tracked Event InsertAreaDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpPut]
        public async Task<String> UpdateTextAreaDocObject([FromBody]SearchDetails searchobj)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient(); 
            String response = null;
            try
            {
                response = await infoDoc.UpdateAreaObjectDocument(searchobj);
                tc.TrackRequest("Track UpdateTextAreaDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("UpdateTextAreaDocObject Metric", 100);
                tc.TrackEvent("Tracked Event UpdateTextAreaDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpDelete]
        public async Task<String> DeletingAreaDocObject(string deleteid, string secretkey)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                    new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                    new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.deletingAreaobjectDocument(deleteid, secretkey);
                tc.TrackRequest("Track DeletingAreaDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("DeletingAreaDocObject Metric", 100);
                tc.TrackEvent("Tracked Event DeletingAreaDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }


        //Object Search Api Location Group

        [HttpPost]
        public async Task<String> InsertLoc_GroupDocObject([FromBody] SearchDetails searchobj)
        {

            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            String response = null;
            var tc = new TelemetryClient();
            try
            {
                response = await infoDoc.SetLocGroupDoc(searchobj);
                tc.TrackRequest("Track InsertLoc_GroupDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("InsertLoc_GroupDocObject Metric", 100);
                tc.TrackEvent("Tracked Event InsertLoc_GroupDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }


        [HttpPut]
        public async Task<String> EditingText_GroupDocObject([FromBody]SearchDetails searchobj)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.UpdateLocGroupObjectDoc(searchobj);
                tc.TrackRequest("Track EditingText_GroupDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("EditingText_GroupDocObject Metric", 100);
                tc.TrackEvent("Tracked Event EditingText_GroupDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpDelete]
        public async Task<String> DeletingLoc_GroupDocObject(string deleteid, string secretkey)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                    new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                    new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                 response = await infoDoc.deletingLocGroupobjectDoc(deleteid, secretkey);
                tc.TrackRequest("Track DeletingLoc_GroupDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("DeletingLoc_GroupDocObject Metric", 100);
                tc.TrackEvent("Tracked Event DeletingLoc_GroupDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        //Object Search Api People
        [HttpPost]
        public async Task<String> InsertPeopleDocObject([FromBody] SearchDetails searchobj)
        {

            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            { 
                response = await infoDoc.SetPeopleDoc(searchobj);
                tc.TrackRequest("Track InsertPeopleDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("InsertPeopleDocObject Metric", 100);
                tc.TrackEvent("Tracked Event InsertPeopleDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpPut]
        public async Task<String> EditingText_PeopleDocObject([FromBody]SearchDetails searchobj)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.UpdatePeopleObjectDoc(searchobj);
                tc.TrackRequest("Track EditingText_PeopleDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("EditingText_PeopleDocObject Metric", 100);
                tc.TrackEvent("Tracked Event EditingText_PeopleDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpDelete]
        public async Task<String> DeletingPeopleDocObject(string deleteid, string secretkey)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                    new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                    new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.deletingPeopleobjectDoc(deleteid, secretkey);
                tc.TrackRequest("Track DeletingPeopleDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("DeletingPeopleDocObject Metric", 100);
                tc.TrackEvent("Tracked Event DeletingPeopleDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        //Insert People With Title Document
        [HttpPost]
        public async Task<String> InsertPeopleWithTitleDocObject([FromBody] SearchDetails searchobj)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.SetPeopleWithTitleDoc(searchobj);
                tc.TrackRequest("Track InsertPeopleWithTitleDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("InsertPeopleWithTitleDocObject Metric", 100);
                tc.TrackEvent("Tracked Event InsertPeopleWithTitleDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        [HttpPut]
        public async Task<String> EditingText_PeopleTitleDocObject([FromBody]SearchDetails searchobj)
        {
            IStatefulSearchApi infoDoc = ServiceProxy.Create<IStatefulSearchApi>(
                     new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                     new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String response = null;
            try
            {
                response = await infoDoc.UpdatePeopleWithTitleObjectDoc(searchobj);
                tc.TrackRequest("Track EditingText_PeopleTitleDocObject Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("EditingText_PeopleTitleDocObject Metric", 100);
                tc.TrackEvent("Tracked Event EditingText_PeopleTitleDocObject");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }

        //[HttpPost]
        //public async Task<String> PostPassword([FromBody]Company email)
        //{
        //    LoginCompany com = new LoginCompany();
        //    string response = await com.sendResetPassword(email.mail);
        //    return await Task.FromResult(response);
        //}


        
        [HttpGet]
        public async Task<String> GetTenantId(String tenantName)
        {
            IStatefulDiagramApi info = ServiceProxy.Create<IStatefulDiagramApi>(
           new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
           new ServicePartitionKey(0));
            var tc = new TelemetryClient();
            String output = null;
            try
            {
                output = await info.GetTenantId(tenantName);
                tc.TrackRequest("Track GetTenantId Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetTenantId Metric", 100);
                tc.TrackEvent("Tracked Event GetTenantId");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return    output;

        }


        //For TimeMachine

        public async Task<String> GetDiagramForTimeMachine(String timeInfo)
        {
            String response = "";
            var tc = new TelemetryClient();
            try
            {
                TimeInfo node = JsonConvert.DeserializeObject<TimeInfo>(timeInfo);

                IStatefulDiagramApi infoDoc = ServiceProxy.Create<IStatefulDiagramApi>(
                        new Uri(uriString: "fabric:/DiagramApp/DiagramApi"),
                        new ServicePartitionKey(0));

                var newDate = DateTime.ParseExact(node.DateAndTime,
                                  "dd/MM/yyyy HH:mm:ss",
                                   System.Globalization.CultureInfo.InvariantCulture);

                // var selectedDate= newDate.ToString("yyyy-MM-dd HH:mm:ss.ff");
                var selectedDate = newDate.ToString("yyyy-MM-dd HH:mm:ss");
                response = await infoDoc.getDiagramFromDatabase(node.DiagramGUID,node.TenantName, selectedDate);
            tc.TrackRequest("Track GetDiagramForTimeMachine Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
            tc.TrackMetric("GetDiagramForTimeMachine Metric", 100);
            tc.TrackEvent("Tracked Event GetDiagramForTimeMachine");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return response;
        }




        [HttpGet]
        public async Task<List<Noteslist>> GetNotesForTimeMachine(String timeInfo)
        {
            List<Noteslist> output = new List<Noteslist>();
            var tc = new TelemetryClient(); 
            try
            {
                NoteInfo node = JsonConvert.DeserializeObject<NoteInfo>(timeInfo);
                var newDate = DateTime.ParseExact(node.DateAndTime,
                                  "dd/MM/yyyy HH:mm:ss",
                                   System.Globalization.CultureInfo.InvariantCulture);

                var selectedDate = newDate.ToString("yyyy-MM-dd HH:mm:ss");

                IStatefulNotesApi noteinfo = ServiceProxy.Create<IStatefulNotesApi>(
                          new Uri(uriString: "fabric:/NotesApp/NotesApi"),
                          new ServicePartitionKey(0));

                output = await noteinfo.getNotesForTimeMachine(node.LocationId,node.TenantName,node.TenantId, selectedDate);

                tc.TrackRequest("Track GetNotesForTimeMachine Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetNotesForTimeMachine Metric", 100);
                tc.TrackEvent("Tracked Event GetNotesForTimeMachine");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
        }



        [HttpGet]
        public async Task<string> GetInfoForTMObjects(String objectInfo)
        {
            string output = "";
            var tc = new TelemetryClient();
            try
            {
                ObjectInfo node = JsonConvert.DeserializeObject<ObjectInfo>(objectInfo);
                var newDate = DateTime.ParseExact(node.DateAndTime,
                                  "dd/MM/yyyy HH:mm:ss",
                                   System.Globalization.CultureInfo.InvariantCulture);

                // var selectedDate= newDate.ToString("yyyy-MM-dd HH:mm:ss.ff");

                var selectedDate = newDate.ToString("yyyy-MM-dd HH:mm:ss");

                IStatefulInfoApi noteinfo = ServiceProxy.Create<IStatefulInfoApi>(
                          new Uri(uriString: "fabric:/InfoPaneApp/InfoPaneApi"),
                          new ServicePartitionKey(0));

                output = await noteinfo.GetInfoForTimeMachine(node.LocationId, node.NodeType, node.TenantName, node.TenantId, selectedDate);
                tc.TrackRequest("Track GetInfoForTMObjects Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetInfoForTMObjects Metric", 100);
                tc.TrackEvent("Tracked Event GetInfoForTMObjects");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();

            return output;
        }


        public async Task<String> GetPeopleForTimeMachine(String peopleInfo)
        {
            var tc = new TelemetryClient();
            string people = null;
            try
            {

                PeopleInfo node = JsonConvert.DeserializeObject<PeopleInfo>(peopleInfo);


                IStatefullPeopleApi iuser = ServiceProxy.Create<IStatefullPeopleApi>(new Uri(uriString: "fabric:/PeopleApp/PeopleApi"), new ServicePartitionKey(0));

                var newDate = DateTime.ParseExact(node.DateAndTime,
                                  "dd/MM/yyyy HH:mm:ss",
                                   System.Globalization.CultureInfo.InvariantCulture);

                // var selectedDate= newDate.ToString("yyyy-MM-dd HH:mm:ss.ff");

                var selectedDate = newDate.ToString("yyyy-MM-dd HH:mm:ss");

                people = await iuser.getPeopleForTimeMachine(node.GUID, node.TenantName, selectedDate);

                tc.TrackRequest("Track GetPeopleForTimeMachine Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetPeopleForTimeMachine Metric", 100);
                tc.TrackEvent("Tracked Event GetPeopleForTimeMachine");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            if (people == null)
            {
                return "NOT";
            }
            else
            {
                return people;
            }
        }

        [HttpGet]
        public async Task<string> GetSearchDocumentForTimeMachine(String searchInfo)
        {

            string output = "";
            var tc = new TelemetryClient();
            try
            {
                SearchInfo node = JsonConvert.DeserializeObject<SearchInfo>(searchInfo);

                var newDate = DateTime.ParseExact(node.DateAndTime,
                                  "dd/MM/yyyy HH:mm:ss",
                                   System.Globalization.CultureInfo.InvariantCulture);

                // var selectedDate= newDate.ToString("yyyy-MM-dd HH:mm:ss.ff");

                var selectedDate = newDate.ToString("yyyy-MM-dd HH:mm:ss");

                IStatefulSearchApi searchobj = ServiceProxy.Create<IStatefulSearchApi>(
                new Uri(uriString: "fabric:/ObjectSearchApp/ObjectSearchApi"),
                new ServicePartitionKey(0));
                output = await searchobj.GetlistDocumentForTM(node.SearchCharacter, selectedDate, node.SecretKey,node.TenantName);

                tc.TrackRequest("Track GetPeopleForTimeMachine Request", DateTimeOffset.UtcNow, new TimeSpan(0, 0, 3), "200", true);
                tc.TrackMetric("GetPeopleForTimeMachine Metric", 100);
                tc.TrackEvent("Tracked Event GetPeopleForTimeMachine");
            }
            catch (Exception ex)
            {
                tc.TrackException(ex);
            }
            tc.Flush();
            return output;
            
        }

        [HttpGet]
        public async Task<String> GetLocationObjectFromSchema(String nodetype, String tenantName, String tenantId)
        {
            String result = "";

            try
            {
                IStatefulDocumentApi docDb = ServiceProxy.Create<IStatefulDocumentApi>(
                                                 new Uri(uriString: "fabric:/DocumentDBApp/DocumentDBApi"), new ServicePartitionKey(0));
                 result = await docDb.GetLocationObjectFromSchema(nodetype, tenantName, tenantId);
               
            }
            catch (Exception ex) {
            }
            return result;
        }
    }
}
