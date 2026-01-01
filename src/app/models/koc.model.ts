export interface KocData {
  id?: string;
  channelName: string;
  linkChannel: string;
  isDuplicate: boolean;
  dateFound: string;

  cast: string;
  commission: string;
  note: string;
  recontact: string;

  labels: string[];
  products: string[];
  status: string;

  staff: string;
  manager: string;

  videoLink?: string;
  videoId?: string;
  title?: string;
  dataRetrievalTime?: string;

  sampleSendDate?: string;
  sampleReceiveDate?: string;
  expectedAirDate?: string;
  actualAirDate?: string;

  gmv: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;

  isAd?: boolean;

  channel?: string;
  traffic?: string;
  castApproval?: string;
  shopManagement?: string;

  createdAt: any; // Firestore Timestamp
}
