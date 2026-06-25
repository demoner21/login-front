import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';

type WSEventType = 'task_created' | 'task_updated' | 'task_deleted' | 'task_shared';

interface WSMessage {
    type: WSEventType;
    task_id?: string;
    payload?: unknown;
    user_id: string;
    timestamp: string;
}

interface UseTaskSocketOptions {
    onTaskCreated?: (taskId: string, payload: unknown) => void;
    onTaskUpdated?: (taskId: string, payload: unknown) => void;
    onTaskDeleted?: (taskId: string) => void;
    onTaskShared?: (taskId: string, payload: unknown) => void;
}

const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 30000;

/**
 * Canal de eventos de domínio em tempo real (não é chat).
 * Hoje cobre: criação/edição/exclusão de tarefas e compartilhamento.
 * Futuro: atribuição de tarefa, mudanças de status de safra, etc —
 * basta o backend emitir um novo `type` e adicionar o callback aqui.
 */
export function useTaskSocket(options: UseTaskSocketOptions) {
    const { token, isAuthenticated } = useAuth();
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectAttempt = useRef(0);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shouldReconnect = useRef(true);
    const optionsRef = useRef(options);
    optionsRef.current = options;

    const connect = useCallback((currentToken: string) => {
        const apiBase = import.meta.env.VITE_API_BASE_URL as string;
        const wsBase = apiBase.replace(/^http/, 'ws');
        const socket = new WebSocket(`${wsBase}/tasks/ws?token=${encodeURIComponent(currentToken)}`);
        socketRef.current = socket;

        socket.onopen = () => {
            reconnectAttempt.current = 0;
        };

        socket.onmessage = (event) => {
            try {
                const message: WSMessage = JSON.parse(event.data);
                const { onTaskCreated, onTaskUpdated, onTaskDeleted, onTaskShared } = optionsRef.current;

                switch (message.type) {
                    case 'task_created':
                        onTaskCreated?.(message.task_id ?? '', message.payload);
                        break;
                    case 'task_updated':
                        onTaskUpdated?.(message.task_id ?? '', message.payload);
                        break;
                    case 'task_deleted':
                        onTaskDeleted?.(message.task_id ?? '');
                        break;
                    case 'task_shared':
                        onTaskShared?.(message.task_id ?? '', message.payload);
                        break;
                }
            } catch {
                // payload mal formado — ignora silenciosamente
            }
        };

        socket.onclose = () => {
            socketRef.current = null;
            if (!shouldReconnect.current) return;

            const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** reconnectAttempt.current, RECONNECT_MAX_DELAY);
            reconnectAttempt.current += 1;
            reconnectTimer.current = setTimeout(() => connect(currentToken), delay);
        };

        socket.onerror = () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        shouldReconnect.current = true;
        connect(token);

        return () => {
            shouldReconnect.current = false;
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, [connect, isAuthenticated, token]);
}