import { useQuery } from "@tanstack/react-query";

import { getMeetings } from "@/services/api";
import type { MeetingFilters } from "@/types";

export function useMeetings(filters: MeetingFilters) {
  return useQuery({
    queryKey: ["meetings", filters],
    queryFn: () => getMeetings(filters),
  });
}
