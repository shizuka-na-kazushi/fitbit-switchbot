import * as document from "document";
import * as messaging from "messaging";
import * as Crypto from "crypto";
import {config} from "../common/config";

const token = config.token;
const secret = config.secret;

messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");
});

// UI components here!!
const buttonToOn = document.getElementById("button-to-on");
const buttonToOff = document.getElementById("button-to-off");
const buttonToChangeSpeed = document.getElementById("button-to-fan-speed");
const buttonToSwing = document.getElementById("button-to-fan-swing");

buttonToOn.addEventListener("click", (evt) => {
  console.log("On is CLICKED");
  senSwitchCommand("power", true);
})

// buttonToOff.addEventListener("click", (evt) => {
//   console.log("Off is CLICKED");
//   senSwitchCommand("power", false);
// })

buttonToChangeSpeed.addEventListener("click", (evt) => {
  senSwitchCommand("change-speed");
});

buttonToSwing.addEventListener("click", (evt) => {
  senSwitchCommand("swing");
});

function senSwitchCommand(command, value) {
  const nonce = "requestId";
  const t = Date.now().toString();

  generateSignature(token, secret, t, nonce).then((sign) => {
    const data = {
      command: command,
      value: value,
      token: token, sign: sign, t: t, nonce: nonce,
    }

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(data);    
    }
  })
}

// String を　ArrayBufferに変換する関数
function str2arrayBuffer(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// ArrayBufferをBase64文字列に変換する関数
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  let binary = "";
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let base64 = '';
  let group;
  for (let i = 0; i < binary.length; i += 3) {
    group = (binary.charCodeAt(i) << 16) | (binary.charCodeAt(i + 1) << 8) | binary.charCodeAt(i + 2);
    base64 += chars[(group >> 18) & 63];
    base64 += chars[(group >> 12) & 63];
    base64 += chars[(group >> 6) & 63];
    base64 += chars[group & 63];
  }
  if (binary.length % 3 === 1) {
    base64 = base64.slice(0, -2) + '==';
  } else if (binary.length % 3 === 2) {
    base64 = base64.slice(0, -1) + '=';
  }
  return base64;
}

// 非同期でbase64形式のsignatureを生成する
async function generateSignature(token, secret, t, nonce) {
  const data = token + t + nonce;

  // シークレットからキーを生成
  const keyMaterial = await Crypto.subtle.importKey(
    "raw",
    str2arrayBuffer(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // HMACを計算
  const signature = await Crypto.subtle.sign(
    "HMAC",
    keyMaterial,
    str2arrayBuffer(data)
  );

  // Base64エンコーディング
  return arrayBufferToBase64(signature);
}


