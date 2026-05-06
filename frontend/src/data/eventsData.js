import { technicalEventsData } from './technicalEventsData';
import { culturalEventsData } from './culturalEventsData';
import { managementEventsData } from './managementEventsData';

export const eventsData = {
  ...technicalEventsData,
  ...culturalEventsData,
  ...managementEventsData
};
