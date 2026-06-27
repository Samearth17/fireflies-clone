export interface MeetingListItem {
  id: number;
  title: string;
  duration_seconds: number;
  meeting_date: string;
  participants: string[];
  summary_preview: string;
  action_count: number;
}

export interface TranscriptSegment {
  id: number;
  speaker: string;
  start_time_seconds: number;
  end_time_seconds: number;
  text: string;
}

export interface Summary {
  id: number;
  overview: string;
  key_topics: string[];
  decisions: string[];
  action_items: number;
}

export interface ActionItem {
  id: number;
  meeting: number;
  description: string;
  owner: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export interface MeetingDetail {
  id: number;
  title: string;
  duration_seconds: number;
  meeting_date: string;
  participants: string[];
  transcript_segments: TranscriptSegment[];
  summary: Summary | null;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface MeetingPayload {
  title: string;
  meeting_date: string;
  duration_seconds: number;
  participants: string[];
  text?: string;
}

export interface MeetingFilters {
  search?: string;
  sort?: "recent" | "oldest";
  date?: string;
}
