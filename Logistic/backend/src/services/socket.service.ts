import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

interface LocationPayload {
  driverId: string;
  orderId?: string;
  lat: number;
  lng: number;
  speed: number;
  heading?: number;
  timestamp: string;
}

// ─── Online Driver Registry ───────────────────────────────────────────────────
const _onlineDrivers = new Map<string, string>(); // driverId → socketId

export class SocketService {
  private static io: SocketIOServer;

  // ─── Initialization ─────────────────────────────────────────────────────────
  static init(server: HttpServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 30_000,
      pingInterval: 25_000,
    });

    console.log('🔌 Socket.io initialized for Live Driver Tracking');

    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`);

      // ── Driver registers itself ──────────────────────────────────────────────
      socket.on('driver:register', (driverId: string) => {
        if (!driverId) return;
        _onlineDrivers.set(driverId, socket.id);
        socket.join(`driver:${driverId}`);
        console.log(`[Socket] Driver registered: ${driverId} (${socket.id})`);
        socket.emit('driver:registered', { driverId, socketId: socket.id });
      });

      // ── Driver emits live location ────────────────────────────────────────────
      socket.on('driver:update_location', (data: LocationPayload) => {
        if (!data.driverId) return;

        const payload: LocationPayload = {
          ...data,
          timestamp: new Date().toISOString(),
        };

        // Broadcast to buyers/mandi tracking this order
        if (data.orderId) {
          socket.to(`order:${data.orderId}`).emit('location_update', payload);
        }

        // Also emit to the driver's own room (for multi-device sync)
        socket.to(`driver:${data.driverId}`).emit('location_update', payload);
      });

      // ── Buyer/Mandi joins an order-tracking room ──────────────────────────────
      socket.on('buyer:track_order', (orderId: string) => {
        if (!orderId) return;
        socket.join(`order:${orderId}`);
        console.log(`[Socket] Client ${socket.id} now tracking order: ${orderId}`);
        socket.emit('tracking:joined', { orderId });
      });

      // ── Heartbeat to confirm connection is alive ───────────────────────────────
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      // ── Cleanup on disconnect ────────────────────────────────────────────────
      socket.on('disconnect', (reason) => {
        // Remove driver from online registry
        for (const [driverId, socketId] of _onlineDrivers.entries()) {
          if (socketId === socket.id) {
            _onlineDrivers.delete(driverId);
            console.log(`[Socket] Driver ${driverId} went offline (${reason})`);
            break;
          }
        }
        console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);
      });
    });
  }

  // ─── Static helpers (called by HTTP controllers) ─────────────────────────────

  /**
   * Broadcasts a driver's location update to all order-room subscribers.
   * Called by LocationController after updating the in-memory cache.
   */
  static emitLocationUpdate(payload: LocationPayload): void {
    if (!this.io) return;

    if (payload.orderId) {
      this.io.to(`order:${payload.orderId}`).emit('location_update', payload);
    }
    this.io.to(`driver:${payload.driverId}`).emit('location_update', payload);
  }

  /**
   * Returns the Socket.io server instance.
   */
  static getIO(): SocketIOServer {
    if (!this.io) throw new Error('[Socket] Socket.io has not been initialized!');
    return this.io;
  }

  /**
   * Returns a snapshot of currently online drivers.
   */
  static getOnlineDrivers(): Record<string, string> {
    return Object.fromEntries(_onlineDrivers);
  }
}

