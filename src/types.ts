export type BusStatusType = 'LIVE' | 'REPORTED' | 'SCHEDULED' | 'UNKNOWN';

export type OperatorType = 'government' | 'private';

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timeOffsetMinutes: number;
  isMajor: boolean;
  landmark?: string;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  operator: string;
  operatorType: OperatorType;
  busType: string;
  origin: string;
  destination: string;
  originStopName: string;
  destinationStopName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  durationFormatted: string;
  fare: number;
  walkingMinutes: number;
  walkingFormatted: string;
  accessible: boolean;
  status: BusStatusType;
  statusText: string;
  statusDetail: string;
  lastUpdated: string;
  frequency: string;
  stops: RouteStop[];
  coordinates: [number, number][];
  currentLocation?: {
    lat: number;
    lng: number;
    description: string;
    speedKmH?: number;
  };
  tags?: string[];
  reliabilityScore?: number; // e.g. 94%
}

export interface TransportAlert {
  id: string;
  title: string;
  routeNumber: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  time: string;
  date: string;
  description: string;
  location: string;
  affectedStops?: string[];
}

export type IssueType =
  | 'Bus delayed'
  | 'Bus cancelled'
  | 'Bus did not arrive'
  | 'Wrong route'
  | 'Overcrowding'
  | 'Stop issue'
  | 'Other';

export interface PassengerReport {
  id: string;
  routeId: string;
  routeNumber: string;
  busService: string;
  location: string;
  issueType: IssueType;
  description: string;
  timestamp: string;
  commuterName?: string;
  status: 'Pending Verification' | 'Verified' | 'Resolved';
  upvotes: number;
}

export interface JourneySearchPreferences {
  preference: 'all' | 'fastest' | 'cheapest' | 'least-walking' | 'accessible';
  departureTime?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredJourney?: {
    routeNumber: string;
    routeName: string;
    boardStop: string;
    exitStop: string;
    duration: string;
    fare: number;
    walking: string;
    status: BusStatusType;
    statusDetail: string;
    routeId?: string;
  };
  groundingNotice?: string;
}
