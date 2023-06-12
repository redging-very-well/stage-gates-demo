const app = require("./app.js");

const appPort = 3000;
const internalApiPort = 3001;
const probePort = 8089;

app.mainApi.listen(appPort, () =>
  console.log(`Example app listening on ${appPort}`)
);
app.internalApi.listen(internalApiPort, () =>
  console.log(`Internal api listening on ${internalApiPort}`)
);
app.probeApi.listen(probePort, () =>
  console.log(`Probe listening on ${probePort}`)
);
