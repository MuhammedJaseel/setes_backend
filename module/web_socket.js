var wss;
exports.connectWebSocket = (_wss) => {
  wss = _wss;
  wss.on("connection", (ws, req) => {
    const path = (ws.conn_id = req.url.split("/"));

    ws.conn_type = "mobile";
    ws.conn_id = path[2];

    ws.on("close", function (reasonCode, description) {
      if (ws.admin === true) console.log("Admin Web Scocket Disconected");
      else console.log(" disconnected");
    });
  });
};

exports.getAllConnectedSocket = (req, res) => {
  wss.clients.forEach(function (client) {
    if (client.conn_type === "ctaker") client.send(client.conn_type);
  });
  res.send("wsws");
};
