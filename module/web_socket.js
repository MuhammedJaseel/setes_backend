var wss;
exports.connectWebSocket = (_wss) => {
  wss = _wss;
  wss.on("connection", (ws, req) => {
    if (!validateUser(req.headers)) ws.close();
    else {
      console.log(req.headers);
      ws.who = req.headers.who??'';
      ws.id = req.headers.user_id??'';
    }
    ws.on("close", function (reasonCode, description) {
      // console.log("One WS Disconnected");
    });
  });
};

exports.getAllConnectedSocket = (req, res) => {
  var response = [];
  wss.clients.forEach(function (client) {
    response.push({ id: client.id, who: client.who });
  });
  res.send(response);
  // sendSocketMsg("users", "hallow", false, "vxcvcxv");
};

const validateUser = (data) => {
  // const who = "\nType:" + data.who;
  // const id = "\nID:" + data.user_id;
  // const key = "\nKey:" + data.key;
  // console.log("\nOne WS Connection" + who + id + key);
  return true;
};

exports.sendSocketMsg = (who, msg, all, id) => {
  wss.clients.forEach(function (client) {
    if (client.who == who) if (all || client.id == id) client.send(msg);
  });
};
