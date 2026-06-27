import axios from "axios";

import type { ActionItem, MeetingDetail, MeetingFilters, MeetingListItem, MeetingPayload, Summary, TranscriptSegment } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getMeetings(filters: MeetingFilters) {
  const { data } = await api.get<MeetingListItem[]>("/meetings", { params: filters });
  return data;
}

export async function getMeeting(id: number) {
  const { data } = await api.get<MeetingDetail>(`/meetings/${id}`);
  return data;
}

export async function createMeeting(payload: MeetingPayload) {
  const { data } = await api.post<MeetingDetail>("/meetings", payload);
  return data;
}

export async function updateMeeting(id: number, payload: MeetingPayload) {
  const { data } = await api.put<MeetingDetail>(`/meetings/${id}`, payload);
  return data;
}

export async function deleteMeeting(id: number) {
  await api.delete(`/meetings/${id}`);
}

export async function getTranscript(id: number) {
  const { data } = await api.get<TranscriptSegment[]>(`/meetings/${id}/transcript`);
  return data;
}

export async function uploadTranscript(id: number, text: string) {
  const { data } = await api.post<TranscriptSegment[]>(`/meetings/${id}/transcript`, { text });
  return data;
}

export async function searchTranscript(id: number, query: string) {
  const { data } = await api.get<TranscriptSegment[]>(`/meetings/${id}/transcript/search`, { params: { q: query } });
  return data;
}

export async function getSummary(id: number) {
  const { data } = await api.get<Summary>(`/meetings/${id}/summary`);
  return data;
}

export async function regenerateSummary(id: number) {
  const { data } = await api.post<Summary>(`/meetings/${id}/summary/regenerate`);
  return data;
}

export async function getActions(id: number) {
  const { data } = await api.get<ActionItem[]>(`/meetings/${id}/actions`);
  return data;
}

export async function createAction(id: number, payload: Pick<ActionItem, "description" | "owner" | "due_date">) {
  const { data } = await api.post<ActionItem>(`/meetings/${id}/actions`, payload);
  return data;
}

export async function updateAction(id: number, payload: Partial<Pick<ActionItem, "description" | "owner" | "due_date" | "completed">>) {
  const { data } = await api.put<ActionItem>(`/actions/${id}`, payload);
  return data;
}

export async function deleteAction(id: number) {
  await api.delete(`/actions/${id}`);
}
