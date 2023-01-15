const { translate } = require("free-translate");
const createHttpProxyAgent = require("http-proxy-agent");
const languageMappings = require("./languageCodes");

const ipAddresses = [
  "162.240.75.37:80",
  "149.129.184.250:8080",
  "139.162.44.152:51053",
  "47.253.105.175:5566",
  "68.183.185.62:80",
  "159.203.61.169:8080",
  "47.254.239.51:8080",
  "114.143.242.234:80",
  "200.105.215.22:33630",
  "54.210.239.35:80",
];

const agents = ipAddresses.map((s) => createHttpProxyAgent("http://" + s));
const translateText = async (msg, to = "en") => {
  const translatedText = await translate(msg, { from: "en", to });
  return translatedText;
};

module.exports = translateText;
