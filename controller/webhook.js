const VERIFY_TOKEN = "helloworldthisiswhatsappelectionswebhookintesting";
module.exports.getHome = (req, res) => {
  console.log("get request");
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

module.exports.postHome = async (req, res) => {
  console.log("post request");
  const body = req.body;
  const challenge = req.query["hub.challenge"];
  console.log(JSON.stringify(body, null, 2));
  if (req.body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      let msg_body = "";
      if (req.body.entry[0].changes[0].value.messages[0].text)
        msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
      let voter = null;
      console.log("This is the card number", msg_body);
      try {
        voter = await Voter.find({ cardno: msg_body });
        console.log(voter[0]);
        voter = voter[0];
        if (voter) {
          msg_body = `This is your details:\nWard_no: ${voter.Ward_no}\nSLNO: ${voter.SLNO}\nHouse No: ${voter.houseno}\nName: ${voter.VNAME_ENGLISH}\nAge: ${voter.Age}\nCard No.: ${voter.cardno}`;
        } else {
          msg_body = "Voter not found";
        }

        console.log("Message Body = ", msg_body);

        await sendMessage(phone_number_id, from, msg_body);
      } catch {
        console.log("Voter not found");
      }
    }
    res.sendStatus(200).send(challenge);
  } else {
    res.sendStatus(404);
  }
};
