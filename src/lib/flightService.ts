import { Flight, Seat, SearchParams } from '@/store/bookingStore';
import { worldAirports, findNearestAirport, Airport } from './airportData';

const airlines = [
  { name: 'SkyWing Airlines', code: 'SW' },
  { name: 'Pacific Airways', code: 'PA' },
  { name: 'Global Express', code: 'GE' },
  { name: 'Azure Airlines', code: 'AZ' },
  { name: 'Horizon Air', code: 'HA' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Air France', code: 'AF' },
  { name: 'Delta Airlines', code: 'DL' },
  { name: 'United Airlines', code: 'UA' },
  { name: 'American Airlines', code: 'AA' },
  { name: 'Air India', code: 'AI' },
  { name: 'IndiGo', code: '6E' },
  { name: 'SpiceJet', code: 'SG' },
];

export const getAirports = () => worldAirports;

const getRandomAirline = () => airlines[Math.floor(Math.random() * airlines.length)];

const generateFlightNumber = (airlineCode: string) => {
  return `${airlineCode}${Math.floor(Math.random() * 9000) + 1000}`;
};

const generateDuration = (fromAirport: Airport, toAirport: Airport, stops: number) => {
  // Calculate approximate flight time based on distance
  const R = 6371;
  const dLat = (toAirport.lat - fromAirport.lat) * Math.PI / 180;
  const dLng = (toAirport.lng - fromAirport.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromAirport.lat * Math.PI / 180) * Math.cos(toAirport.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Average speed 800 km/h, plus 30 min for takeoff/landing
  const flightHours = distance / 800;
  const totalMinutes = Math.round((flightHours + 0.5) * 60) + (stops * 90);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const generateTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 12) * 5;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const calculatePrice = (classType: string, daysUntilFlight: number, distance: number) => {
  // Base price based on distance (roughly ₹7 per km for economy)
  let basePrice = Math.max(5000, Math.round(distance * 7));

  if (classType === 'business') basePrice *= 3;
  if (classType === 'first') basePrice *= 6;

  // Dynamic pricing based on days until flight
  let multiplier = 1;
  if (daysUntilFlight < 1) multiplier = 2.5;
  else if (daysUntilFlight < 7) multiplier = 1.8;
  else if (daysUntilFlight < 14) multiplier = 1.4;
  else if (daysUntilFlight < 30) multiplier = 1.1;
  else multiplier = 0.85;

  return Math.round(basePrice * multiplier + Math.random() * 100);
};

export interface FlightSearchResult {
  flights: Flight[];
  fromAirport: Airport;
  toAirport: Airport;
  fromNearestInfo?: { originalCity: string; distance: number };
  toNearestInfo?: { originalCity: string; distance: number };
}

export const searchFlights = (params: SearchParams): FlightSearchResult => {
  const daysUntilFlight = Math.max(0, Math.ceil(
    (new Date(params.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));

  // Find airports for origin and destination
  const fromResult = findNearestAirport(params.from);
  const toResult = findNearestAirport(params.to);

  // Fallback to default airports if not found
  const fromAirport = fromResult?.airport || worldAirports[0];
  const toAirport = toResult?.airport || worldAirports[1];

  // Calculate distance for pricing
  const R = 6371;
  const dLat = (toAirport.lat - fromAirport.lat) * Math.PI / 180;
  const dLng = (toAirport.lng - fromAirport.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromAirport.lat * Math.PI / 180) * Math.cos(toAirport.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const numFlights = Math.floor(Math.random() * 5) + 4;
  const flights: Flight[] = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = getRandomAirline();
    const stops = distance > 5000 ? (Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0) : (Math.random() > 0.7 ? 1 : 0);
    const departureTime = generateTime();

    flights.push({
      id: `flight-${Date.now()}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: generateFlightNumber(airline.code),
      from: fromAirport.city,
      fromCode: fromAirport.code,
      to: toAirport.city,
      toCode: toAirport.code,
      departureTime,
      arrivalTime: generateTime(),
      duration: generateDuration(fromAirport, toAirport, stops),
      price: calculatePrice(params.classType, daysUntilFlight, distance),
      classType: params.classType,
      availableSeats: Math.floor(Math.random() * 50) + 10,
      aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A350', 'Boeing 777', 'Airbus A380'][Math.floor(Math.random() * 6)],
      stops,
      delayRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    });
  }

  return {
    flights: flights.sort((a, b) => a.price - b.price),
    fromAirport,
    toAirport,
    fromNearestInfo: fromResult && !fromResult.isExactMatch ? { originalCity: params.from, distance: fromResult.distance } : undefined,
    toNearestInfo: toResult && !toResult.isExactMatch ? { originalCity: params.to, distance: toResult.distance } : undefined,
  };
};

export const generateSeats = (flightId: string, classType: string): Seat[] => {
  const seats: Seat[] = [];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = classType === 'first' ? 4 : classType === 'business' ? 8 : 30;

  for (let row = 1; row <= rows; row++) {
    for (const col of columns) {
      const isEmergency = row === 14 || row === 15;
      const isPremium = row <= 5 && classType === 'economy';
      const isBooked = Math.random() > 0.7;

      seats.push({
        id: `${flightId}-${row}${col}`,
        row,
        column: col,
        type: isEmergency ? 'emergency' : isPremium ? 'premium' : 'standard',
        status: isBooked ? 'booked' : 'available',
        price: isPremium ? 3500 : isEmergency ? 2500 : 0,
        legroom: row === 1 || isEmergency ? 'extra' : 'standard',
        isWindow: col === 'A' || col === 'F',
        isAisle: col === 'C' || col === 'D',
      });
    }
  }

  return seats;
};

export const getPredictedFares = (from: string, to: string) => {
  const today = new Date();
  const fares: { date: string; price: number; level: 'low' | 'medium' | 'high' }[] = [];

  // Get airports for distance-based pricing
  const fromResult = findNearestAirport(from);
  const toResult = findNearestAirport(to);
  const fromAirport = fromResult?.airport || worldAirports[0];
  const toAirport = toResult?.airport || worldAirports[1];

  // Calculate distance
  const R = 6371;
  const dLat = (toAirport.lat - fromAirport.lat) * Math.PI / 180;
  const dLng = (toAirport.lng - fromAirport.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(fromAirport.lat * Math.PI / 180) * Math.cos(toAirport.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const basePrice = Math.max(5000, Math.round(distance * 7));

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let price = basePrice;
    if (isWeekend) price *= 1.3;
    if (i < 7) price *= 1.5;
    else if (i < 14) price *= 1.2;
    else if (i > 21) price *= 0.9;

    price += Math.random() * 50 - 25;
    price = Math.round(price);

    const avgPrice = basePrice * 1.15;
    let level: 'low' | 'medium' | 'high' = 'medium';
    if (price < avgPrice * 0.9) level = 'low';
    else if (price > avgPrice * 1.2) level = 'high';

    fares.push({
      date: date.toISOString().split('T')[0],
      price,
      level
    });
  }

  return fares;
};
