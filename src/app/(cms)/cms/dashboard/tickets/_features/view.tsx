"use client";

import Link from "next/link";
import { MessageSquare, Search, Filter, Clock, Eye } from "lucide-react";
import Select, { StylesConfig } from "react-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import useTicketsAdminViewModel from "./viewModel";
import type { TicketAdminItem } from "./model";
import type { TicketStatus } from "@/lib/supabase/types";
interface SelectOption {
  value: string;
  label: string;
}

const statusMap: Record<TicketStatus, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "bg-amber-100 text-amber-800 border-amber-200" },
  em_progresso: { label: "Em Progresso", color: "bg-blue-100 text-blue-800 border-blue-200" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

const statusOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'aberto', label: 'Aberto' },
  { value: 'em_progresso', label: 'Em Progresso' },
  { value: 'finalizado', label: 'Finalizado' }
];

const topicOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos os Tópicos' },
  { value: 'aula', label: 'Aula' },
  { value: 'cadastro', label: 'Cadastro' },
  { value: 'curso', label: 'Curso' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'reclamacao', label: 'Reclamação' }
];

const customSelectStyles: StylesConfig<SelectOption> = {
  control: (base, { isFocused }) => ({
    ...base,
    paddingLeft: '1.75rem',
    minHeight: '38px',
    borderColor: isFocused ? '#0f766e' : '#e5e7eb',
    borderWidth: '1px',
    boxShadow: isFocused ? '0 0 0 2px #0f766e' : 'none',
    '&:hover': {
      borderColor: '#0f766e'
    }
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected ? '#0f766e' : isFocused ? '#f0fdfa' : 'white',
    color: isSelected ? 'white' : '#1f2937',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#0f766e',
      color: 'white'
    }
  }),
  
  menu: (base) => ({
    ...base,
    zIndex: 20
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1f2937'
  })
};

export default function TicketsAdminView({ initialTickets }: { initialTickets: TicketAdminItem[] }) {
  const { 
    tickets, statusFilter, setStatusFilter, topicFilter, setTopicFilter, searchTerm, setSearchTerm 
  } = useTicketsAdminViewModel(initialTickets);

  const handleStatusChange = (option: SelectOption | null) => {
    setStatusFilter(option?.value || 'todos');
  };

  const handleTopicChange = (option: SelectOption | null) => {
    setTopicFilter(option?.value || 'todos');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-teal-950">Gestão de Tickets</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie e responda aos chamados de suporte dos alunos.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por ID ou Nome do Aluno..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ color: '#1f2937' }}
          />
        </div>
        
        <div className="flex gap-4">
          {/* Select de Status */}
          <div className="relative w-full sm:w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" aria-hidden="true" />
            <Select<SelectOption>
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === statusFilter) || null}
              onChange={handleStatusChange}
              styles={customSelectStyles}
              isSearchable={false}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Status"
            />
          </div>

          {/* Select de Tópicos */}
          <div className="relative w-full sm:w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" aria-hidden="true" />
            <Select<SelectOption>
              options={topicOptions}
              value={topicOptions.find(opt => opt.value === topicFilter) || null}
              onChange={handleTopicChange}
              styles={customSelectStyles}
              isSearchable={false}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Tópico"
            />
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" aria-hidden="true" />
            <p className="text-muted-foreground font-medium">Nenhum ticket encontrado.</p>
            <p className="text-xs text-gray-400 mt-1">Tente ajustar os filtros acima.</p>
          </div>
        ) : (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {ticket.unreadCount > 0 ? (
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500 animate-pulse" title="Nova mensagem não lida" />
                    ) : (
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-teal-950">{ticket.aluno_nome}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-semibold capitalize text-teal-800">{ticket.topico}</span>
                      <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border", statusMap[ticket.status].color)}>
                        {statusMap[ticket.status].label}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {formatDate(ticket.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                        {ticket.total_mensagens} interações
                      </span>
                      <span className="font-mono text-gray-400 truncate w-24 sm:w-auto">ID: {ticket.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center self-end sm:self-auto gap-3">
                  <Button variant="outline" size="sm" className="text-teal-900 border-teal-200 hover:bg-teal-50">
                    <Link href={`/cms/dashboard/tickets/${ticket.id}`}>
                      <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                      Analisar Ticket
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}