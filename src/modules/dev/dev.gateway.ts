import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer
} from '@nestjs/websockets';
import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '../../logger/logger.service.js';
import { kv } from '@nkp/kv';
import { Config } from '../../config.js';
import chokidar from 'chokidar';
import * as io from 'socket.io';
import path from 'node:path';

const serverComm = {
  sendVersion: 'server::send-version',
  message: 'server::message',
  refresh: 'server::refresh',
};

const clientComm = {
  getVersion: 'client::get-version',
  message: 'client::message',
};

interface DevWsCtx {
  id: string;
  log: Logger;
  connected: boolean;
}

@WebSocketGateway({ namespace: 'dev', })
export class DevGateway implements
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
{
  private version = Math.floor(10000 * Math.random()).toString(16);
  private connections = 0;
  private idSeq = 0;
  private ctxs = new WeakMap<io.Socket, DevWsCtx>();
  private readonly watcher: chokidar.FSWatcher;

  @WebSocketServer()
  private readonly server!: io.Server;

  constructor(
    @Inject(Logger) private readonly log: Logger,
  ) {
    this.log.setContext(this);
    this.watcher = chokidar.watch(Config.DIR_PUBLIC);
    this.watcher.add(Config.DIR_VIEWS);
  }

  private getCtx(socket: io.Socket): DevWsCtx {
    return this.ctxs.get(socket)!;
  }

  afterInit() {
    this.log.info('initialised');
    this.watcher.on('all', this.handleClientDirChanged);
  }

  private readonly handleClientDirChanged = (
    eventName: 'add'|'addDir'|'change'|'unlink'|'unlinkDir',
    _path: string,
  ) => {
    const msg = kv({ eventName, path: path.relative(Config.DIR_ROOT, _path), });
    this.log.info(msg);
    this.server.emit(serverComm.refresh);
  };

  handleConnection(client: io.Socket) {
    this.connections += 1;
    let ctx = this.ctxs.get(client);
    if (!ctx) {
      const id = (this.idSeq += 1).toString();
      const log = this.log.child(`Dev::WS::${id}`);
      ctx = { id, connected: true, log, };
      this.ctxs.set(client, ctx);
    }
    ctx.connected = true;
    ctx.log.info(`connected ${this.connections}`);
  }

  handleDisconnect(client: io.Socket) {
    this.connections -= 1;
    const ctx = this.getCtx(client);
    ctx.connected = false;
    ctx.log.info(`disconnected ${this.connections}`);
  }

  @SubscribeMessage(clientComm.getVersion)
  handleGetVersion(client: io.Socket) {
    const ctx = this.getCtx(client);
    ctx.log.info('[received]: ' + kv(clientComm.getVersion));
    ctx.log.info('[sending]: ' + kv(serverComm.sendVersion));
    client.emit(serverComm.sendVersion, this.version);
  }

  @SubscribeMessage(clientComm.message)
  handleMessage(client: io.Socket, message: unknown) {
    const ctx = this.getCtx(client);
    ctx.log.info('[received]: ' + kv(clientComm.message));
  }
}