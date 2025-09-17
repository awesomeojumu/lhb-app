const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const LiveMetricsService = require('./liveMetricsService')

/**
 * WebSocket Service
 *
 * Handles real-time communication for live metrics updates
 */
class WebSocketService {
  constructor () {
    this.wss = null
    this.clients = new Map() // Map of userId -> Set of WebSocket connections
    this.isRunning = false
  }

  /**
   * Start WebSocket server
   * @param {Object} server - HTTP server instance
   */
  start (server) {
    if (this.isRunning) {
      console.log('WebSocket server already running')
      return
    }

    this.wss = new WebSocket.Server({
      server,
      path: '/ws'
    })

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection attempt')

      // Extract token from query parameters
      const url = new URL(req.url, `http://${req.headers.host}`)
      const token = url.searchParams.get('token')

      if (!token) {
        console.log('No token provided, closing connection')
        ws.close(1008, 'Authentication token required')
        return
      }

      // Verify JWT token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        console.log(`WebSocket connection authenticated for user: ${userId}`)

        // Store client connection
        if (!this.clients.has(userId)) {
          this.clients.set(userId, new Set())
        }
        this.clients.get(userId).add(ws)

        // Set user ID on WebSocket for easy access
        ws.userId = userId

        // Send initial connection confirmation
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'WebSocket connection established',
          timestamp: new Date().toISOString()
        }))

        // Handle incoming messages
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message)
            this.handleMessage(ws, data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format',
              timestamp: new Date().toISOString()
            }))
          }
        })

        // Handle connection close
        ws.on('close', (code, reason) => {
          console.log(`WebSocket connection closed for user ${userId}: ${code} ${reason}`)
          this.removeClient(userId, ws)
        })

        // Handle connection error
        ws.on('error', (error) => {
          console.error(`WebSocket error for user ${userId}:`, error)
          this.removeClient(userId, ws)
        })
      } catch (error) {
        console.log('Invalid token, closing connection:', error.message)
        ws.close(1008, 'Invalid authentication token')
      }
    })

    this.isRunning = true
    console.log('WebSocket server started on /ws')
  }

  /**
   * Handle incoming WebSocket messages
   * @param {WebSocket} ws - WebSocket connection
   * @param {Object} data - Message data
   */
  async handleMessage (ws, data) {
    const { type, payload } = data

    switch (type) {
      case 'ping':
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }))
        break

      case 'get_metrics':
        try {
          const metrics = await LiveMetricsService.getAllLiveMetrics(ws.userId)
          ws.send(JSON.stringify({
            type: 'metrics_updated',
            payload: metrics,
            timestamp: new Date().toISOString()
          }))
        } catch (error) {
          console.error('Error getting metrics for WebSocket client:', error)
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to fetch metrics',
            timestamp: new Date().toISOString()
          }))
        }
        break

      default:
        console.log(`Unknown message type: ${type}`)
    }
  }

  /**
   * Remove client connection
   * @param {string} userId - User ID
   * @param {WebSocket} ws - WebSocket connection
   */
  removeClient (userId, ws) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      userClients.delete(ws)
      if (userClients.size === 0) {
        this.clients.delete(userId)
      }
    }
  }

  /**
   * Broadcast message to all clients
   * @param {Object} message - Message to broadcast
   */
  broadcast (message) {
    const messageStr = JSON.stringify(message)

    this.clients.forEach((userClients, userId) => {
      userClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(messageStr)
          } catch (error) {
            console.error(`Error sending message to user ${userId}:`, error)
            this.removeClient(userId, ws)
          }
        }
      })
    })
  }

  /**
   * Send message to specific user
   * @param {string} userId - User ID
   * @param {Object} message - Message to send
   */
  sendToUser (userId, message) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      const messageStr = JSON.stringify(message)

      userClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(messageStr)
          } catch (error) {
            console.error(`Error sending message to user ${userId}:`, error)
            this.removeClient(userId, ws)
          }
        }
      })
    }
  }

  /**
   * Broadcast metrics update to all connected clients
   */
  async broadcastMetricsUpdate () {
    try {
      // Get overall metrics for broadcast
      const metrics = await LiveMetricsService.getAllLiveMetrics()

      this.broadcast({
        type: 'metrics_updated',
        payload: metrics,
        timestamp: new Date().toISOString()
      })

      console.log('Broadcasted metrics update to all clients')
    } catch (error) {
      console.error('Error broadcasting metrics update:', error)
    }
  }

  /**
   * Broadcast KPI status change event
   * @param {string} userId - User ID (optional, null for all users)
   * @param {Object} kpiData - KPI data
   */
  broadcastKPIStatusChange (userId = null, kpiData = {}) {
    const message = {
      type: 'kpi_status_changed',
      payload: kpiData,
      timestamp: new Date().toISOString()
    }

    if (userId) {
      this.sendToUser(userId, message)
    } else {
      this.broadcast(message)
    }
  }

  /**
   * Broadcast KPI created event
   * @param {Object} kpiData - KPI data
   */
  broadcastKPICreated (kpiData) {
    this.broadcast({
      type: 'kpi_created',
      payload: kpiData,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Broadcast KPI updated event
   * @param {Object} kpiData - KPI data
   */
  broadcastKPIUpdated (kpiData) {
    this.broadcast({
      type: 'kpi_updated',
      payload: kpiData,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Get connection statistics
   * @returns {Object} Connection stats
   */
  getStats () {
    let totalConnections = 0
    this.clients.forEach(userClients => {
      totalConnections += userClients.size
    })

    return {
      isRunning: this.isRunning,
      totalUsers: this.clients.size,
      totalConnections,
      users: Array.from(this.clients.keys())
    }
  }

  /**
   * Stop WebSocket server
   */
  stop () {
    if (this.wss) {
      this.wss.close()
      this.wss = null
      this.clients.clear()
      this.isRunning = false
      console.log('WebSocket server stopped')
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService()

module.exports = websocketService
