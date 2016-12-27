// ------------------------------------------------------------
//  Copyright (c) Microsoft Corporation.  All rights reserved.
//  Licensed under the MIT License (MIT). See License.txt in the repo root for license information.
// ------------------------------------------------------------

namespace VisualObjects.WebService
{
    using System;
    using System.Fabric;
    using System.Fabric.Description;
    using System.Globalization;
    using System.Net;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.ServiceFabric.Services.Communication.Runtime;
    using System.Collections.Generic;
    using Microsoft.ServiceBus.Messaging;
    using ServerStatelessService;

    public class WebSocketApp : ICommunicationListener, IDisposable
    {
        //private readonly IVisualObjectsBox visualObjectBox;
        private readonly string appRoot;
        private readonly string webSocketRoot;
        private readonly ServiceContext serviceContext;
        private string listeningAddress;
        private string publishAddress;
        private HttpListener httpListener;
        private CancellationTokenSource cts = new CancellationTokenSource();
        public List<WebSocket> iList;
        public WebSocketApp(string appRoot, string webSocketRoot, ServiceContext initParams)
        {
            //this.visualObjectBox = visualObjectBox;
            this.appRoot = string.IsNullOrWhiteSpace(appRoot) ? string.Empty : appRoot.TrimEnd('/') + '/';
            this.webSocketRoot = string.IsNullOrWhiteSpace(webSocketRoot) ? string.Empty : webSocketRoot.TrimEnd('/') + '/';
            this.serviceContext = initParams;
            iList = new List<WebSocket>();
        }

        public Task<string> OpenAsync(CancellationToken cancellationToken)
        {
            ServiceEventSource.Current.Message("Initialize");

            EndpointResourceDescription serviceEndpoint = this.serviceContext.CodePackageActivationContext.GetEndpoint("ServiceEndpoint");
            int port = serviceEndpoint.Port;

            this.listeningAddress = string.Format(CultureInfo.InvariantCulture, "http://+:{0}/{1}{2}", port, this.appRoot, this.webSocketRoot);

            this.publishAddress = this.listeningAddress.Replace("+", FabricRuntime.GetNodeContext().IPAddressOrFQDN);

            this.Start();

            ServiceEventSource.Current.Message("=======> Starting web socket server on {0}", this.listeningAddress);

            return Task.FromResult(this.publishAddress);
        }

        Task ICommunicationListener.CloseAsync(CancellationToken cancellationToken)
        {
            this.StopAll();
            return Task.FromResult(true);
        }

        void ICommunicationListener.Abort()
        {
            this.StopAll();
            this.Dispose();
        }

        public void Dispose()
        {
            try
            {
                if (this.httpListener != null && this.httpListener.IsListening)
                {
                    ServiceEventSource.Current.Message("Stopping web socket server.");
                    this.httpListener.Close();
                }
            }
            catch (ObjectDisposedException)
            {
            }
            catch (AggregateException ae)
            {
                ae.Handle(
                    ex =>
                    {
                        ServiceEventSource.Current.Message(ex.Message);
                        return true;
                    });
            }
        }

        public void Start()
        {
            this.httpListener = new HttpListener();
            this.httpListener.Prefixes.Add(this.listeningAddress);
            this.httpListener.Start();

            Task.Run(
                async () =>
                {
                    // This loop continuously listens for incoming client connections
                    // as you might normally do with a web socket server.
                    while (true)
                    {
                        ServiceEventSource.Current.Message("=====> Waiting for connection..");

                        this.cts.Token.ThrowIfCancellationRequested();

                        HttpListenerContext context = await this.httpListener.GetContextAsync();

                        Task<Task> acceptTask = context.AcceptWebSocketAsync(null).ContinueWith(
                            async task =>
                            {
                                HttpListenerWebSocketContext websocketContext = task.Result;

                                ServiceEventSource.Current.Message("=======> Connection from " + websocketContext.Origin);

                                using (WebSocket browserSocket = websocketContext.WebSocket)
                                {
                                    iList.Add(browserSocket);
                                    ServiceEventSource.Current.Message("*****************> Client list " + iList);

                                    while (true)
                                    {
                                        byte[] receiveBuffer = new byte[1024];

                                        this.cts.Token.ThrowIfCancellationRequested();

                                        try
                                        {
                                            WebSocketReceiveResult receiveResult = await browserSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);
                                            if (receiveResult.MessageType == WebSocketMessageType.Close)
                                            {
                                                iList.Remove(browserSocket);
                                                await browserSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                                            }
                                            else
                                            {
                                                var connectionString = "Endpoint=sb://siftgridpipelineworkbusf.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=3Jl3kx/azv+GPu/BY7cSbg4QSmz6ltco4FZfaHqniJg=";
                                                var queueName = "reading";
                                                var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
                                                string data = null;

                                                client.OnMessage(async message =>
                                                {
                                                    try
                                                    {
                                                        data = message.GetBody<string>();
                                                        byte[] buffer = Encoding.UTF8.GetBytes(data);
                                                        foreach (WebSocket socket in iList)
                                                        {
                                                            ServiceEventSource.Current.Message("*****************> socket : " + socket);
                                                            await
                                                             socket.SendAsync(
                                                               new ArraySegment<byte>(buffer, 0, buffer.Length),
                                                               WebSocketMessageType.Text,
                                                               true,
                                                               this.cts.Token);

                                                            if (socket.State != WebSocketState.Open)
                                                            {
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    catch (Exception e)
                                                    {

                                                    }
                                                });

                                            }

                                            
                                        }
                                        catch (WebSocketException ex)
                                        {
                                            // If the browser quit or the socket was closed, exit this loop so we can get a new browser socket.
                                            ServiceEventSource.Current.Message(ex.InnerException != null ? ex.InnerException.Message : ex.Message);

                                            break;
                                        }

                                        // wait a bit and continue. This determines the client refresh rate.
                                        await Task.Delay(TimeSpan.FromMilliseconds(1), this.cts.Token);
                                    }
                                }

                                ServiceEventSource.Current.Message("Client disconnected.");
                            },
                            TaskContinuationOptions.OnlyOnRanToCompletion);
                    }
                },
                this.cts.Token);
        }

        private void StopAll()
        {
            this.cts.Cancel();

            try
            {
                if (this.httpListener != null)
                {
                    ServiceEventSource.Current.Message("Stopping web socket server.");
                    this.httpListener.Abort();
                }
                if (this.cts != null)
                {
                    this.cts.Dispose();
                }
            }
            catch (ObjectDisposedException)
            {
            }
        }
    }
}