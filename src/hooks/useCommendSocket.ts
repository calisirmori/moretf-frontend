// hooks/useCommendSocket.ts
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.more.tf";
export interface CommendEvent {
  logId: string;
  commenderId: string;
  commendedId: string;
  timestamp?: string;
}

type OnCommend = (event: CommendEvent) => void;

export function useCommendSocket(logId: string, onCommend: OnCommend) {
  const stompClient = useRef<CompatClient | null>(null);

  useEffect(() => {
    const socketFactory = () => new SockJS(`${baseUrl}/ws`);
    const client = Stomp.over(socketFactory);
    client.reconnectDelay = 5000;
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe(`/topic/log/${logId}/commends`, (message) => {
        try {
          const event = JSON.parse(message.body);
          onCommend(event);
        } catch (e) {
          console.error("Failed to parse commend event", e);
        }
      });
    });

    stompClient.current = client;

    return () => {
      stompClient.current?.disconnect();
    };
  }, [logId, onCommend]);
}
