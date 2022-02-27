exports.mobileGetseteshome = (req, res) => {
  const tempData = {
    events: [
      { _id: "112121212", title: "Test event", img: "test.jpg" },
      { _id: "343434", title: "Test event", img: "test.jpg" },
      { _id: "12123313", title: "Test event", img: "test.jpg" },
      { _id: "878898", title: "Test event", img: "test.jpg" },
    ],
    players: [
      { _id: "112121212", name: "name1", img: "test.jpg" },
      { _id: "343434", name: "name1", img: "test.jpg" },
      { _id: "12123313", name: "name1", img: "test.jpg" },
    ],
    profile: {
      img: "profile.png",
    },
  };
  res.send(tempData);
};
