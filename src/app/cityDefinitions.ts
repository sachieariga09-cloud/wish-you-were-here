import { getUtcOffsetHoursForTimezone } from './utils/utcOffsetFromTimezone';

export const cityDefinitions = [
  {
    name: 'Tokyo',
    videoId: '8H3nRCFVR6Y',
    timezone: 'Asia/Tokyo',
    temperature: 18,
    lat: 35.6595,
    lon: 139.7004,
  },
  {
    name: 'Paris',
    videoId: 'OzYp4NRZlwQ',
    timezone: 'Europe/Paris',
    temperature: 12,
    lat: 48.8566,
    lon: 2.3522,
  },
  {
    name: 'New York',
    videoId: 'z-jYdOIKcTQ',
    timezone: 'America/New_York',
    temperature: 8,
    lat: 40.7128,
    lon: -74.006,
  },
  {
    name: 'Los Angeles',
    videoId: 'EO_1LWqsCNE',
    timezone: 'America/Los_Angeles',
    temperature: 16,
    lat: 34.0522,
    lon: -118.2437,
  },
  {
    name: 'Dublin',
    videoId: '3nyPER2kzqk',
    timezone: 'Europe/Dublin',
    temperature: 10,
    lat: 53.3498,
    lon: -6.2603,
  },
  {
    name: 'Cape Town',
    videoId: 'khhdEM2Q_68',
    isLive: true,
    embedShareId: 'lUpGuh1r6KhxEnYY',
    timezone: 'Africa/Johannesburg',
    temperature: 22,
    lat: -33.9249,
    lon: 18.4241,
  },
  {
    name: 'Sydney',
    videoId: '5uZa3-RMFos',
    timezone: 'Australia/Sydney',
    temperature: 24,
    lat: -33.8688,
    lon: 151.2093,
  },
  {
    name: 'Taipei',
    videoId: 'Ndo_8RuefH4',
    timezone: 'Asia/Taipei',
    temperature: 20,
    lat: 25.033,
    lon: 121.5654,
  },
] as const;

export type CityDefinition = (typeof cityDefinitions)[number];

export const cities = [...cityDefinitions].sort((a, b) => {
  const offA = getUtcOffsetHoursForTimezone(a.timezone);
  const offB = getUtcOffsetHoursForTimezone(b.timezone);
  if (offB !== offA) return offB - offA;
  return a.name.localeCompare(b.name);
});
