import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apiToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('apiToken');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', message, error);
    
    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Authentication
  async setAuthToken(token) {
    localStorage.setItem('apiToken', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  async clearAuthToken() {
    localStorage.removeItem('apiToken');
    delete api.defaults.headers.Authorization;
  }

  // Health and Status
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  }

  async getStatus() {
    const response = await api.get('/status');
    return response.data;
  }

  // Orchestrator Control
  async startOrchestrator(scheduleFile = 'channel_schedule.json') {
    const response = await api.post('/orchestrator/start', null, {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  async stopOrchestrator() {
    const response = await api.post('/orchestrator/stop');
    return response.data;
  }

  // Schedule Management
  async getSchedules(scheduleFile = 'channel_schedule.json') {
    const response = await api.get('/schedules', {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  async getSchedule(scheduleId, scheduleFile = 'channel_schedule.json') {
    const response = await api.get(`/schedules/${scheduleId}`, {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  async createSchedule(scheduleData, scheduleFile = 'channel_schedule.json') {
    const response = await api.post('/schedules', 
      { schedule: scheduleData },
      { params: { schedule_file: scheduleFile } }
    );
    return response.data;
  }

  async updateSchedule(scheduleId, scheduleData, scheduleFile = 'channel_schedule.json') {
    const response = await api.put(`/schedules/${scheduleId}`, 
      { schedule: scheduleData },
      { params: { schedule_file: scheduleFile } }
    );
    return response.data;
  }

  async deleteSchedule(scheduleId, scheduleFile = 'channel_schedule.json') {
    const response = await api.delete(`/schedules/${scheduleId}`, {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  // Channel Management
  async getChannels() {
    const response = await api.get('/channels');
    return response.data;
  }

  async manualChannelControl(scheduleId, action) {
    const response = await api.post('/channels/manual', {
      schedule_id: scheduleId,
      action: action
    });
    return response.data;
  }

  // Pipeline Management
  async getPipelines() {
    const response = await api.get('/pipelines');
    return response.data;
  }

  async startPipeline(scheduleId, options = {}) {
    const response = await api.post(`/pipelines/${scheduleId}/start`, {
      schedule_id: scheduleId,
      ...options
    });
    return response.data;
  }

  async stopPipeline(scheduleId) {
    const response = await api.post(`/pipelines/${scheduleId}/stop`);
    return response.data;
  }

  // Highlights
  async getHighlights(filters = {}) {
    const response = await api.get('/highlights', { params: filters });
    return response.data;
  }

  async getHighlightsSummary() {
    const response = await api.get('/highlights/summary');
    return response.data;
  }

  async getHighlightsMonitoring(hours = 24) {
    const response = await api.get('/highlights/monitoring', {
      params: { hours }
    });
    return response.data;
  }

  async getPipelineMonitoring(pipelineId, hours = 24) {
    const response = await api.get(`/highlights/monitoring/pipeline/${pipelineId}`, {
      params: { hours }
    });
    return response.data;
  }

  // Files
  async getSegmentFiles(filters = {}) {
    const response = await api.get('/files/segments', { params: filters });
    return response.data;
  }

  // Configuration
  async getGlobalConfig(scheduleFile = 'channel_schedule.json') {
    const response = await api.get('/config/global', {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  async updateGlobalConfig(config, scheduleFile = 'channel_schedule.json') {
    const response = await api.put('/config/global', config, {
      params: { schedule_file: scheduleFile }
    });
    return response.data;
  }

  // Content Generation
  async getContentItems(filters = {}) {
    const response = await api.get('/content/items', { params: filters });
    return response.data;
  }

  async getContentItem(contentId) {
    const response = await api.get(`/content/items/${contentId}`);
    return response.data;
  }

  async getContentFiles(filters = {}) {
    const response = await api.get('/content/files', { params: filters });
    return response.data;
  }

  async getContentProgress(matchId = null) {
    const params = matchId ? { match_id: matchId } : {};
    const response = await api.get('/content/progress', { params });
    return response.data;
  }

  async getActiveContentMatches() {
    const response = await api.get('/content/matches');
    return response.data;
  }

  async postToSocialMedia(platform, contentId, message = null) {
    const params = new URLSearchParams();
    params.append('platform', platform);
    params.append('content_id', contentId);
    if (message) {
      params.append('message', message);
    }
    
    const response = await api.post('/content/social/post', null, { params });
    return response.data;
  }

  async initializeContentGeneration(matchId, homeTeam, awayTeam, options = {}) {
    const response = await api.post('/content/initialize', {
      match_id: matchId,
      home_team: homeTeam,
      away_team: awayTeam,
      ...options
    });
    return response.data;
  }

  async startContentGeneration(matchId) {
    const response = await api.post(`/content/matches/${matchId}/start`);
    return response.data;
  }

  async processContentHighlights(matchId, highlights) {
    const response = await api.post(`/content/matches/${matchId}/process`, {
      match_id: matchId,
      highlights: highlights
    });
    return response.data;
  }

  async endContentGeneration(matchId) {
    const response = await api.post(`/content/matches/${matchId}/end`);
    return response.data;
  }
}

// WebSocket service
class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(url = null) {
    const wsUrl = url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
          this.emit(data.type, data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data = null) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }
}

// Export instances
export const apiService = new ApiService();
export const wsService = new WebSocketService();

// Toast helpers
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 6000,
    position: 'top-right',
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'ℹ️',
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export default apiService;