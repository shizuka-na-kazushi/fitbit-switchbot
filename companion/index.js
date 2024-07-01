import * as messaging from "messaging";
import {config} from "../common/config";

const baseUrl = 'https://api.switch-bot.com';
const deviceId = config.deviceId;


messaging.peerSocket.addEventListener("message", (evt) => {
  const msg = evt.data;
  console.log(JSON.stringify(evt.data));

  if (msg.command === "power") {
    fanPower(msg.value, msg.token, msg.sign, msg.t, msg.nonce);
  } else if (msg.command === "change-speed") {
    fanSpeed(msg.token, msg.sign, msg.t, msg.nonce);
  } else if (msg.command === "swing") {
    fanSwing(msg.token, msg.sign, msg.t, msg.nonce);
  } else if (msg.command === "log-devices") {
    devices(msg.token, msg.sign, msg.t, msg.nonce);
  } else {
    console.error(`Command "${msg.command}" is unknown`);
  }
});

const devices = (token, sign, t, nonce) => {
  const url = baseUrl + '/v1.1/devices'
  const method = 'GET'

  fetch(url, {
      method: method,
      headers: {
          "Authorization": token,
          "sign": sign,
          "nonce": nonce,
          "t": t,
          'Content-Type': 'application/json',
      }
  }).then((r) => r.json()).then((json) => {
      console.log('------ devices -----')
      console.log(JSON.stringify(json, null, ' '))
  })
}

const fanPower = (enable, token, sign, t, nonce) => {
  const url = baseUrl + `/v1.1/devices/${deviceId}/commands`
  const method = 'POST'

  const body = JSON.stringify({
      command: enable ? 'turnOn' : 'turnOff',
      parameter: 'default',
      commandType: 'command'
  })

  fetch(url, {
      method: method,
      headers: {
          "Authorization": token,
          "sign": sign,
          "nonce": nonce,
          "t": t,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
      },
      body: body,
  }).then((r) => r.json()).then((json) => {
      console.log(`------ fan command (${enable ? 'turnOn' : 'turnOff'}) (deviceId: ${deviceId}) -----`)
      console.log(JSON.stringify(json, null, ' '))
  })
}


const fanSpeed = (token, sign, t, nonce) => {
  const url = baseUrl + `/v1.1/devices/${deviceId}/commands`
  const method = 'POST'

  const body = JSON.stringify({
      command: "lowSpeed",
      parameter: 'default',
      commandType: 'command'
  })

  fetch(url, {
      method: method,
      headers: {
          "Authorization": token,
          "sign": sign,
          "nonce": nonce,
          "t": t,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
      },
      body: body,
  }).then((r) => r.json()).then((json) => {
      console.log(`------ fan speed command (deviceId: ${deviceId}) -----`)
      console.log(JSON.stringify(json, null, ' '))
  })
}

const fanSwing = (token, sign, t, nonce) => {
  const url = baseUrl + `/v1.1/devices/${deviceId}/commands`
  const method = 'POST'

  const body = JSON.stringify({
      command: "swing",
      parameter: 'default',
      commandType: 'command'
  })

  fetch(url, {
      method: method,
      headers: {
          "Authorization": token,
          "sign": sign,
          "nonce": nonce,
          "t": t,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
      },
      body: body,
  }).then((r) => r.json()).then((json) => {
      console.log(`------ fan swing command (deviceId: ${deviceId}) -----`)
      console.log(JSON.stringify(json, null, ' '))
  })
}