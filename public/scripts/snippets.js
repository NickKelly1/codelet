import _io from './socket.io.esm.min.js';
import { socketEvent } from './constants.js';

const SNIPPETS_URL = window.location.origin + '/snippets';

/**
 * @typedef {import('socket.io-client')['io']} IO
 * @typedef {import('socket.io-client').Socket} Socket
 */

// const serverComm = {
//   sendVersion: 'server::send-version',
//   message: 'server::message',
//   refresh: 'server::refresh',
// };

// const clientComm = {
//   getVersion: 'client::get-version',
//   message: 'client::message',
// };

/** @type {IO} */
const io = _io;

/**
 * @param {Event} event
 */
export function snippets() {
  /** @type {Socket} */
  console.info(`[snippets] connecting to ${SNIPPETS_URL}...`);

  const socket = io(SNIPPETS_URL, {
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
  console.info('[snippets] connected');

  socket.once(socketEvent.disconnect, handleDisconnect);

  function handleDisconnect() {
    console.info('[snippets] [disconnect] cleaning up');
  }
}

/**
 * @param {Socket} socket
 * @param {Error} err
 */
function handleConnectError(socket, err) {
  console.info('[snippets] connect error', err);
}

/**
 * @param {Socket} socket
 * @param {string} reason
 */
function handleDisconnect(_, reason) {
  console.info('[snippets] disconnected', reason);
}
