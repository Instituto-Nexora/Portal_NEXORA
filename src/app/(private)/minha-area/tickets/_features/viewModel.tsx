"use client";

import type { TicketListItem } from "./model";

export type TicketsListViewModel = {
  tickets: TicketListItem[];
};

const useTicketsListViewModel = (initialTickets: TicketListItem[]): TicketsListViewModel => {
  return { tickets: initialTickets };
};

export default useTicketsListViewModel;