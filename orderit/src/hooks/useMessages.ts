'use client';

import { useState } from "react";
import type { Message } from "@/types";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  return {
    messages,
    loading: false,
    addMessage: (message: Message) => setMessages((current) => [...current, message]),
  };
}
