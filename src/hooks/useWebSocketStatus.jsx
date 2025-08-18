import { useEffect, useState, useRef } from 'react';
import { wsService } from '../services/api.jsx';

// Connection status values: 'connected' | 'reconnecting' | 'disconnected'
export function useWebSocketStatus() {
  const [status, setStatus] = useState('disconnected');
  const [attempt, setAttempt] = useState(0);
  const [lastEvent, setLastEvent] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const onConnected = () => {
      if (!mounted.current) return;
      setStatus('connected');
      setAttempt(0);
    };
    const onDisconnected = () => {
      if (!mounted.current) return;
      setStatus('disconnected');
    };
    const onReconnecting = (data) => {
      if (!mounted.current) return;
      setStatus('reconnecting');
      setAttempt(data?.attempt || 1);
    };
    const onMessage = (evt) => {
      if (!mounted.current) return;
      setLastEvent(evt);
    };

    wsService.on('connected', onConnected);
    wsService.on('disconnected', onDisconnected);
    wsService.on('reconnecting', onReconnecting);
    wsService.on('message', onMessage);

    return () => {
      mounted.current = false;
      wsService.off('connected', onConnected);
      wsService.off('disconnected', onDisconnected);
      wsService.off('reconnecting', onReconnecting);
      wsService.off('message', onMessage);
    };
  }, []);

  return { status, attempt, lastEvent };
}
