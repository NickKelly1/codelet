import _io from './socket.io.esm.min.js';
import { socketEvent } from './constants.js';

const DEV_URL = window.location.origin + '/dev';

/**
 * @typedef {import('socket.io-client')['io']} IO
 * @typedef {import('socket.io-client').Socket} Socket
 */

const serverComm = {
  sendVersion: 'server::send-version',
  message: 'server::message',
  refresh: 'server::refresh',
};

const clientComm = {
  getVersion: 'client::get-version',
  message: 'client::message',
};

/** @type {IO} */
const io = _io;

/** @type {null | string} */
let version = null;

/**
 * @param {Event} event
 */
export function development() {
  /** @type {Socket} */
  console.info(`[dev] connecting to ${DEV_URL}...`);

  const socket = io(DEV_URL, {
    upgrade: true,
    autoConnect: false,
  });

  socket.on(socketEvent.connect, () => handleConnect(socket));
  socket.on(socketEvent.connect_error, (err) => handleConnectError(socket, err));
  socket.on(socketEvent.disconnect, (reason) => handleDisconnect(socket, reason));

  socket.connect();
}


/**
 * @param {Socket} socket
 */
function handleConnect(socket) {
  console.info('[dev] connected');

  socket.once(socketEvent.disconnect, handleDisconnect);
  socket.on(serverComm.message, handleMessage);
  socket.on(serverComm.sendVersion, handleSendVersion);
  socket.on(serverComm.refresh, handleRefresh);

  console.info(`[dev] [sending]: ${clientComm.getVersion}`);
  socket.emit(clientComm.getVersion);

  function handleDisconnect() {
    console.info('[dev] [disconnect] cleaning up');
    socket.off(serverComm.message, handleMessage);
    socket.off(serverComm.sendVersion, handleSendVersion);
    socket.off(serverComm.refresh, handleRefresh);
  }

  function handleMessage(message) {
    console.info(`[dev] [received]: ${serverComm.message}`, message);
  }

  function handleRefresh() {
    console.info(`[dev] [received]: ${serverComm.refresh}`);
    doReload();
  }

  function handleSendVersion(thisVersion) {
    console.info(`[dev] [received]: ${serverComm.sendVersion}`, thisVersion);
    if (version != null && thisVersion !== version) {
      console.info('[dev] version changed');
      doReload();
      return;
    }
    version = thisVersion;
  }
}

/**
 * @param {Socket} socket
 * @param {Error} err
 */
function handleConnectError(socket, err) {
  console.info('[dev] connect error', err);
}

/**
 * @param {Socket} socket
 * @param {string} reason
 */
function handleDisconnect(_, reason) {
  console.info('[dev] disconnected', reason);
}

function doReload() {
  console.info('[dev] reloading...');
  location.reload();
}