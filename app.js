const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const WebSocket = require("ws");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(fileUpload());

const { empty } = require("./module/empty");

const { mobileIsuptodate } = require("./method/mobile_isuptodate");
const { mobileAuth, adminAuth, ctakerAuth } = require("./module/auth");
const { mobileLogin, mobileSendotp } = require("./method/mobile_login");
const { mobileEnterasGust } = require("./method/mobile_login");
const { mobileRegister } = require("./method/mobile_register");
const { mobileGethome } = require("./method/mobile_home");
const { mobileGetseteshome } = require("./method/mobile_seteshome");
const { mobileScorebord } = require("./method/mobils_scorebord");
const { mobileGetTrufs, mobileVerifyBooking } = require("./method/mobile_truf");
const { mobileGettruf, mobileBookTruf } = require("./method/mobile_truf");
const { mobileGetSlot } = require("./method/mobile_slot");
const { mobileGetPropfile, mobileGetNoti } = require("./method/mobile_profile");
const { mobileUpdtaeProfilePic } = require("./method/mobile_profile");
const { mobilePutProfile } = require("./method/mobile_profile");
const { mobileGetBookings } = require("./method/mobile_profile");
const { mobileToPrime, mobileGetPrimetrufs } = require("./method/mobile_prime");
const { mobileGetPrimedetails } = require("./method/mobile_prime");

const { adminGetMemebers } = require("./method/admin_member");
const { adminGetEvent, adminGetEvents } = require("./method/admin_event");
const { adminPostEvent, adminPutEvent } = require("./method/admin_event");
const { adminDeleteEvent } = require("./method/admin_event");
const { adminGetTruf, adminGetTrufs } = require("./method/admin_truf");
const { adminPostTruf, adminPutTruf } = require("./method/admin_truf");
const { adminDeleteTruf } = require("./method/admin_truf");
const { adminGetslot, adminGetslots } = require("./method/admin_slot");
const { adminPostslot, adminPutslot } = require("./method/admin_slot");
const { adminDeleteslot } = require("./method/admin_slot");
const { adminGetadmins, adminPostadmin } = require("./method/admin_admin");
const { adminPutadmin, adminDeleteadmin } = require("./method/admin_admin");
const { adminGetbookings } = require("./method/admin_booking");
const { adminGetMatchs } = require("./method/admin_match");
const { adminGetCtakers, adminPostCtaker } = require("./method/admin_ctaker");
const { adminPutCtaker, adminGetCtaker } = require("./method/admin_ctaker");
const { adminDeleteCtaker } = require("./method/admin_ctaker");
const { adminGetassets, adminPutassets } = require("./method/admin_asset");

const { ctakerLogin } = require("./method/ctaker_login");
const { ctakerGetProfile } = require("./method/ctaker_profile");
const { ctakerGetMatchs, ctakerGetMatch } = require("./method/ctaket_match");
const { ctakerGetAllMatchs } = require("./method/ctaket_match");
const { ctakerPutslot } = require("./method/ctaket_match");
const { mobileHomeTruf } = require("./method/mobile_hometruf");
const {
  connectWebSocket,
  getAllConnectedSocket,
} = require("./module/web_socket");
const { adminGetHome } = require("./method/admin_home");
const { ctakerAddEvent } = require("./method/ctaker_event");
const { adminGetNoti } = require("./method/admin_noti");

app.use("/asset", express.static("public_asset"));
app.get("/", empty);

app.post("/mobile/isuptodate", mobileIsuptodate);
app.post("/mobile/sendotp", mobileSendotp);
app.post("/mobile/login", mobileLogin);
app.post("/mobile/guestlogin", mobileEnterasGust);
app.post("/mobile/register", mobileAuth, mobileRegister);
app.get("/mobile/home", mobileAuth, mobileGethome);
app.get("/mobile/seteshome", mobileAuth, mobileGetseteshome);
app.get("/mobile/scorebords", mobileAuth, mobileScorebord);
app.get("/mobile/truf", mobileAuth, mobileGettruf);
app.get("/mobile/trufs", mobileAuth, mobileGetTrufs);
app.post("/mobile/verifybooking", mobileAuth, mobileVerifyBooking);
app.post("/mobile/booktruf", mobileAuth, mobileBookTruf);
app.get("/mobile/slot", mobileAuth, mobileGetSlot);
app.get("/mobile/mynoti", mobileAuth, mobileGetNoti);
app.get("/mobile/myprofile", mobileAuth, mobileGetPropfile);
app.post("/mobile/myprofile", mobileAuth, mobileUpdtaeProfilePic);
app.put("/mobile/myprofile", mobileAuth, mobilePutProfile);
app.get("/mobile/bookings", mobileAuth, mobileGetBookings);
app.post("/mobile/toprime", mobileAuth, mobileToPrime);
app.get("/mobile/primedetails", mobileAuth, mobileGetPrimedetails);
app.get("/mobile/primetrufs", mobileAuth, mobileGetPrimetrufs);
app.get("/mobile/hometruf", mobileAuth, mobileHomeTruf);

app.get("/admin/home", adminAuth, adminGetHome);
app.get("/admin/notis", adminAuth, adminGetNoti);
app.get("/admin/members", adminAuth, adminGetMemebers);
app.get("/admin/event", adminAuth, adminGetEvent);
app.get("/admin/events", adminAuth, adminGetEvents);
app.post("/admin/event", adminAuth, adminPostEvent);
app.put("/admin/event", adminAuth, adminPutEvent);
app.delete("/admin/event", adminAuth, adminDeleteEvent);
app.get("/admin/truf", adminAuth, adminGetTruf);
app.get("/admin/trufs", adminAuth, adminGetTrufs);
app.post("/admin/truf", adminAuth, adminPostTruf);
app.put("/admin/truf", adminAuth, adminPutTruf);
app.delete("/admin/truf", adminAuth, adminDeleteTruf);
app.get("/admin/slot", adminAuth, adminGetslot);
app.get("/admin/slots", adminAuth, adminGetslots);
app.post("/admin/slot", adminAuth, adminPostslot);
app.put("/admin/slot", adminAuth, adminPutslot);
app.delete("/admin/slot", adminAuth, adminDeleteslot);
app.get("/admin/admins", adminAuth, adminGetadmins);
app.post("/admin/admin", adminAuth, adminPostadmin);
app.put("/admin/admin", adminAuth, adminPutadmin);
app.delete("/admin/admin", adminAuth, adminDeleteadmin);
app.get("/admin/matchs", adminAuth, adminGetMatchs);
app.get("/admin/bookings", adminAuth, adminGetbookings);
app.get("/admin/ctaker", adminAuth, adminGetCtaker);
app.get("/admin/ctakers", adminAuth, adminGetCtakers);
app.post("/admin/ctaker", adminAuth, adminPostCtaker);
app.put("/admin/ctaker", adminAuth, adminPutCtaker);
app.delete("/admin/ctaker", adminAuth, adminDeleteCtaker);
app.get("/admin/assets", adminAuth, adminGetassets);
app.put("/admin/assets", adminAuth, adminPutassets);

app.post("/ctaker/login", ctakerAuth, ctakerLogin);
app.get("/ctaker/profile", ctakerAuth, ctakerGetProfile);
app.get("/ctaker/matchs", ctakerAuth, ctakerGetMatchs);
app.get("/ctaker/allmatchs", ctakerAuth, ctakerGetAllMatchs);
app.get("/ctaker/match", ctakerAuth, ctakerGetMatch);
app.put("/ctaker/booking", ctakerAuth, ctakerPutslot);
app.post("/ctaker/matchevent", ctakerAuth, ctakerAddEvent);

app.get("/conn", getAllConnectedSocket);

app.get("*", (req, res) => res.send("Hello World!"));
const server = app.listen(3000, () => console.log("Started on 3000"));
const wss = new WebSocket.Server({ server });
connectWebSocket(wss);

// git add .
// git commit -m "seconds Commit"
// git push heroku master
// git init
// heroku git:remote -a apisetes
