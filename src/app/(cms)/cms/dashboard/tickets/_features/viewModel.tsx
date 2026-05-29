"use client";

import { useState, useMemo } from "react";
import type { TicketAdminItem } from "./model";
import type { TicketStatus, TicketTopic } from "@/lib/supabase/types";

export const useTicketsAdminViewModel = (initialTickets: TicketAdminItem[]) => {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "todos">("todos");
  const [topicFilter, setTopicFilter] = useState<TicketTopic | "todos">("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = useMemo(() => {
    return initialTickets.filter((t) => {
      const matchStatus = statusFilter === "todos" || t.status === statusFilter;
      const matchTopic = topicFilter === "todos" || t.topico === topicFilter;
      
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        searchTerm === "" || 
        t.aluno_nome.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower);
        
      return matchStatus && matchTopic && matchSearch;
    });
  }, [initialTickets, statusFilter, topicFilter, searchTerm]);

  return {
    tickets: filteredTickets,
    statusFilter,
    setStatusFilter,
    topicFilter,
    setTopicFilter,
    searchTerm,
    setSearchTerm,
  };
};

export default useTicketsAdminViewModel;