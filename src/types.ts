export interface SurveyResponse {
  id: string; // unique ID
  createdAt: string;
  name: string;
  village: string;
  land: string;
  crops: string[];
  member: string;
  organic: string;
  heard: string[];
  problem: string;
  interest: string;
  topics: string[];
  day: string;
  time: string;
  wtp: string;
  buyinput: string;
  refer: string;
  comments: string;
  mobile: string;
}

export type TabType = 'how-to' | 'form';
