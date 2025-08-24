/**
 * WEBRTC REAL-TIME FEATURES 2030
 * Live collaborative tarot readings and peer-to-peer connections
 */

export interface PeerConnection {
  id: string
  userId: string
  status: 'connecting' | 'connected' | 'disconnected' | 'failed'
  isHost: boolean
  capabilities: {
    audio: boolean
    video: boolean
    screen: boolean
    data: boolean
  }
}

export interface RealtimeReading {
  id: string
  hostId: string
  participants: PeerConnection[]
  cards: any[]
  currentSpeaker: string
  isRecording: boolean
  startTime: number
  status: 'waiting' | 'active' | 'paused' | 'ended'
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: number
  type: 'text' | 'system' | 'card_drawn' | 'interpretation'
}

export interface ScreenShareConfig {
  audio: boolean
  video: boolean
  cursor: 'always' | 'motion' | 'never'
  displaySurface: 'application' | 'browser' | 'monitor' | 'window'
}

class RealtimeFeatures {
  private static instance: RealtimeFeatures
  private peerConnection?: RTCPeerConnection
  private dataChannel?: RTCDataChannel
  private localStream?: MediaStream
  private remoteStreams = new Map<string, MediaStream>()
  private connections = new Map<string, RTCPeerConnection>()
  private isInitialized = false
  private signalingServer?: WebSocket
  private currentRoom?: string
  private userId?: string

  // STUN/TURN servers for NAT traversal
  private readonly iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]

  private constructor() {}

  static getInstance(): RealtimeFeatures {
    if (!RealtimeFeatures.instance) {
      RealtimeFeatures.instance = new RealtimeFeatures()
    }
    return RealtimeFeatures.instance
  }

  // === INITIALIZATION ===
  async initialize(userId: string): Promise<boolean> {
    try {
      this.userId = userId
      await this.setupSignalingServer()
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('WebRTC initialization failed:', error)
      return false
    }
  }

  private async setupSignalingServer(): Promise<void> {
    const wsUrl = import.meta.env.VITE_SIGNALING_SERVER || 'wss://signaling.nightgod-tarot.com'
    
    this.signalingServer = new WebSocket(wsUrl)
    
    this.signalingServer.onopen = () => {
      console.log('Connected to signaling server')
      this.sendSignalingMessage({
        type: 'register',
        userId: this.userId
      })
    }

    this.signalingServer.onmessage = (event) => {
      this.handleSignalingMessage(JSON.parse(event.data))
    }

    this.signalingServer.onerror = (error) => {
      console.error('Signaling server error:', error)
    }

    this.signalingServer.onclose = () => {
      console.log('Signaling server disconnected')
      // Attempt reconnection
      setTimeout(() => this.setupSignalingServer(), 5000)
    }
  }

  // === COLLABORATIVE READING SESSION ===
  async createReadingSession(sessionId: string): Promise<RealtimeReading> {
    if (!this.isInitialized || !this.userId) {
      throw new Error('WebRTC not initialized')
    }

    this.currentRoom = sessionId

    // Join signaling room
    this.sendSignalingMessage({
      type: 'create_room',
      roomId: sessionId,
      userId: this.userId
    })

    // Setup data channel for card sharing
    await this.setupDataChannel()

    const reading: RealtimeReading = {
      id: sessionId,
      hostId: this.userId,
      participants: [{
        id: crypto.randomUUID(),
        userId: this.userId,
        status: 'connected',
        isHost: true,
        capabilities: {
          audio: true,
          video: true,
          screen: true,
          data: true
        }
      }],
      cards: [],
      currentSpeaker: this.userId,
      isRecording: false,
      startTime: Date.now(),
      status: 'waiting'
    }

    return reading
  }

  async joinReadingSession(sessionId: string): Promise<RealtimeReading | null> {
    if (!this.isInitialized || !this.userId) {
      throw new Error('WebRTC not initialized')
    }

    this.currentRoom = sessionId

    // Join signaling room
    this.sendSignalingMessage({
      type: 'join_room',
      roomId: sessionId,
      userId: this.userId
    })

    // Wait for room info response
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 10000) // 10s timeout

      const messageHandler = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.type === 'room_info' && data.roomId === sessionId) {
          clearTimeout(timeout)
          this.signalingServer?.removeEventListener('message', messageHandler)
          resolve(data.reading)
        }
      }

      this.signalingServer?.addEventListener('message', messageHandler)
    })
  }

  // === MEDIA STREAMING ===
  async startAudioVideo(constraints: MediaStreamConstraints = { audio: true, video: true }): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Add tracks to all peer connections
      this.connections.forEach((pc) => {
        this.localStream?.getTracks().forEach(track => {
          pc.addTrack(track, this.localStream!)
        })
      })

      return this.localStream
    } catch (error) {
      console.error('Failed to start audio/video:', error)
      throw error
    }
  }

  async startScreenShare(config: ScreenShareConfig): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: config.cursor,
          displaySurface: config.displaySurface
        } as any,
        audio: config.audio
      })

      // Replace video track in existing connections
      this.connections.forEach((pc) => {
        const videoSender = pc.getSenders().find(sender => 
          sender.track?.kind === 'video'
        )
        
        if (videoSender && screenStream.getVideoTracks()[0]) {
          videoSender.replaceTrack(screenStream.getVideoTracks()[0])
        }
      })

      // Notify other participants
      this.broadcastMessage({
        type: 'screen_share_started',
        userId: this.userId,
        timestamp: Date.now()
      })

      return screenStream
    } catch (error) {
      console.error('Failed to start screen share:', error)
      throw error
    }
  }

  async stopScreenShare(): Promise<void> {
    // Get camera stream back
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
    
    this.connections.forEach((pc) => {
      const videoSender = pc.getSenders().find(sender => 
        sender.track?.kind === 'video'
      )
      
      if (videoSender && cameraStream.getVideoTracks()[0]) {
        videoSender.replaceTrack(cameraStream.getVideoTracks()[0])
      }
    })

    this.broadcastMessage({
      type: 'screen_share_stopped',
      userId: this.userId,
      timestamp: Date.now()
    })
  }

  // === DATA CHANNEL COMMUNICATION ===
  private async setupDataChannel(): Promise<void> {
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers })
    }

    this.dataChannel = this.peerConnection.createDataChannel('tarot_data', {
      ordered: true
    })

    this.dataChannel.onopen = () => {
      console.log('Data channel opened')
    }

    this.dataChannel.onmessage = (event) => {
      this.handleDataChannelMessage(JSON.parse(event.data))
    }

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error)
    }
  }

  shareCard(card: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data channel not ready')
      return
    }

    const message = {
      type: 'card_shared',
      card,
      sharedBy: this.userId,
      timestamp: Date.now()
    }

    this.dataChannel.send(JSON.stringify(message))
  }

  shareInterpretation(interpretation: string, cardId: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      return
    }

    const message = {
      type: 'interpretation_shared',
      interpretation,
      cardId,
      interpretedBy: this.userId,
      timestamp: Date.now()
    }

    this.dataChannel.send(JSON.stringify(message))
  }

  broadcastMessage(message: any): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      return
    }

    this.dataChannel.send(JSON.stringify({
      ...message,
      broadcast: true,
      fromUserId: this.userId
    }))
  }

  // === CHAT SYSTEM ===
  sendChatMessage(message: string): void {
    const chatMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: this.userId!,
      senderName: this.getUserName(this.userId!),
      message,
      timestamp: Date.now(),
      type: 'text'
    }

    this.broadcastMessage({
      type: 'chat_message',
      chatMessage
    })
  }

  sendSystemMessage(message: string, type: ChatMessage['type'] = 'system'): void {
    const systemMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: 'system',
      senderName: 'Night God System',
      message,
      timestamp: Date.now(),
      type
    }

    this.broadcastMessage({
      type: 'chat_message',
      chatMessage: systemMessage
    })
  }

  // === RECORDING FUNCTIONALITY ===
  async startRecording(): Promise<MediaRecorder> {
    if (!this.localStream) {
      throw new Error('No active stream to record')
    }

    const mediaRecorder = new MediaRecorder(this.localStream, {
      mimeType: 'video/webm;codecs=vp9'
    })

    const recordedChunks: Blob[] = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      this.saveRecording(blob)
    }

    mediaRecorder.start(1000) // Collect data every second
    
    // Notify participants
    this.broadcastMessage({
      type: 'recording_started',
      userId: this.userId,
      timestamp: Date.now()
    })

    return mediaRecorder
  }

  private async saveRecording(blob: Blob): Promise<void> {
    // Create download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tarot_reading_${Date.now()}.webm`
    a.click()

    URL.revokeObjectURL(url)
  }

  // === PEER CONNECTION MANAGEMENT ===
  private async createPeerConnection(remoteUserId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers })

    // Add local tracks if available
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      this.remoteStreams.set(remoteUserId, remoteStream)
      
      // Emit event for UI to handle
      window.dispatchEvent(new CustomEvent('remote_stream_added', {
        detail: { userId: remoteUserId, stream: remoteStream }
      }))
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({
          type: 'ice_candidate',
          candidate: event.candidate,
          targetUserId: remoteUserId,
          fromUserId: this.userId
        })
      }
    }

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection with ${remoteUserId}:`, pc.connectionState)
      
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.handlePeerDisconnection(remoteUserId)
      }
    }

    // Handle data channel from remote peer
    pc.ondatachannel = (event) => {
      const channel = event.channel
      channel.onmessage = (msgEvent) => {
        this.handleDataChannelMessage(JSON.parse(msgEvent.data))
      }
    }

    this.connections.set(remoteUserId, pc)
    return pc
  }

  private handlePeerDisconnection(userId: string): void {
    this.connections.delete(userId)
    this.remoteStreams.delete(userId)
    
    // Emit event for UI
    window.dispatchEvent(new CustomEvent('peer_disconnected', {
      detail: { userId }
    }))
  }

  // === SIGNALING MESSAGE HANDLERS ===
  private async handleSignalingMessage(message: any): Promise<void> {
    switch (message.type) {
      case 'user_joined':
        await this.handleUserJoined(message)
        break
      
      case 'offer':
        await this.handleOffer(message)
        break
      
      case 'answer':
        await this.handleAnswer(message)
        break
      
      case 'ice_candidate':
        await this.handleIceCandidate(message)
        break
      
      case 'user_left':
        this.handleUserLeft(message)
        break
      
      default:
        console.log('Unknown signaling message:', message)
    }
  }

  private async handleUserJoined(message: any): Promise<void> {
    const pc = await this.createPeerConnection(message.userId)
    
    // Create offer for new user
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    
    this.sendSignalingMessage({
      type: 'offer',
      offer,
      targetUserId: message.userId,
      fromUserId: this.userId
    })
  }

  private async handleOffer(message: any): Promise<void> {
    const pc = await this.createPeerConnection(message.fromUserId)
    
    await pc.setRemoteDescription(message.offer)
    
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    
    this.sendSignalingMessage({
      type: 'answer',
      answer,
      targetUserId: message.fromUserId,
      fromUserId: this.userId
    })
  }

  private async handleAnswer(message: any): Promise<void> {
    const pc = this.connections.get(message.fromUserId)
    if (pc) {
      await pc.setRemoteDescription(message.answer)
    }
  }

  private async handleIceCandidate(message: any): Promise<void> {
    const pc = this.connections.get(message.fromUserId)
    if (pc) {
      await pc.addIceCandidate(message.candidate)
    }
  }

  private handleUserLeft(message: any): void {
    this.handlePeerDisconnection(message.userId)
  }

  private handleDataChannelMessage(message: any): void {
    // Emit custom events for different message types
    switch (message.type) {
      case 'card_shared':
        window.dispatchEvent(new CustomEvent('card_shared', { detail: message }))
        break
      
      case 'interpretation_shared':
        window.dispatchEvent(new CustomEvent('interpretation_shared', { detail: message }))
        break
      
      case 'chat_message':
        window.dispatchEvent(new CustomEvent('chat_message', { detail: message.chatMessage }))
        break
      
      default:
        window.dispatchEvent(new CustomEvent('realtime_message', { detail: message }))
    }
  }

  // === UTILITY METHODS ===
  private sendSignalingMessage(message: any): void {
    if (this.signalingServer?.readyState === WebSocket.OPEN) {
      this.signalingServer.send(JSON.stringify(message))
    }
  }

  private getUserName(userId: string): string {
    // In a real app, this would fetch from user database
    return `User ${userId.substring(0, 8)}`
  }

  // === PUBLIC API ===
  getConnectionStatus(): { [userId: string]: RTCPeerConnectionState } {
    const status: { [userId: string]: RTCPeerConnectionState } = {}
    
    this.connections.forEach((pc, userId) => {
      status[userId] = pc.connectionState
    })
    
    return status
  }

  getRemoteStreams(): { [userId: string]: MediaStream } {
    const streams: { [userId: string]: MediaStream } = {}
    
    this.remoteStreams.forEach((stream, userId) => {
      streams[userId] = stream
    })
    
    return streams
  }

  async leaveSession(): Promise<void> {
    // Close all peer connections
    this.connections.forEach((pc) => {
      pc.close()
    })
    this.connections.clear()

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = undefined
    }

    // Clear remote streams
    this.remoteStreams.clear()

    // Leave signaling room
    if (this.currentRoom) {
      this.sendSignalingMessage({
        type: 'leave_room',
        roomId: this.currentRoom,
        userId: this.userId
      })
    }

    this.currentRoom = undefined
  }

  async toggleMute(): Promise<boolean> {
    if (!this.localStream) return false

    const audioTrack = this.localStream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      
      this.broadcastMessage({
        type: 'audio_toggled',
        muted: !audioTrack.enabled,
        userId: this.userId,
        timestamp: Date.now()
      })
      
      return !audioTrack.enabled
    }
    return false
  }

  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) return false

    const videoTrack = this.localStream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      
      this.broadcastMessage({
        type: 'video_toggled',
        disabled: !videoTrack.enabled,
        userId: this.userId,
        timestamp: Date.now()
      })
      
      return !videoTrack.enabled
    }
    return false
  }

  isConnected(): boolean {
    return this.isInitialized && !!this.signalingServer && this.signalingServer.readyState === WebSocket.OPEN
  }

  getParticipantCount(): number {
    return this.connections.size + 1 // +1 for local user
  }
}

export const realtimeFeatures = RealtimeFeatures.getInstance()
export default realtimeFeatures