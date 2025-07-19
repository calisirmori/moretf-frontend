// hooks/useCommendSocket.ts
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";

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
    const socketFactory = () => new SockJS("https://api.more.tf/ws");
    const client = Stomp.over(socketFactory);
    client.reconnectDelay = 5000;
    client.debug = () => {};

    client.connect({}, () => {
      client.subscribe(`/topic/commends/${logId}`, (message) => {
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
