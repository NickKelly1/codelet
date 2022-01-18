import { Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer
} from '@nestjs/websockets';
import { WebSocketGateway } from '@nestjs/websockets';
import { Logger } from '../../logger/logger.service.js';
import chalk from 'chalk';
import * as io from 'socket.io';

const serverComm = {
  sendVersion: 'server::send-version',
  message: 'server::message',
  refresh: 'server::refresh',
};

const clientComm = {
  getVersion: 'client::get-version',
  message: 'client::message',
};

interface SnippetWsCtx {
  id: string;
  log: Logger;
  connected: boolean;
}

@WebSocketGateway({ namespace: '/snippets', })
export class SnippetGateway implements
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
{
  private connections = 0;
  private idSeq = 0;
  private ctxs = new WeakMap<io.Socket, SnippetWsCtx>();

  @WebSocketServer()
  private readonly server!: io.Server;

  constructor(
    @Inject(Logger) private readonly log: Logger,
  ) {
    this.log.setContext(this);
  }

  private getCtx(socket: io.Socket): SnippetWsCtx {
    return this.ctxs.get(socket)!;
  }

  afterInit() {
    this.log.info('initialised');
  }

  handleConnection(client: io.Socket) {
    this.connections += 1;
    let ctx = this.ctxs.get(client);
    if (!ctx) {
      const id = (this.idSeq += 1).toString();
      const log = this.log.child(`Snippet::WS::${id}`);
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
}