import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      title: 'Meeting with Team',
      start: new Date(2024, 10, 15, 10, 0), 
      end: new Date(2024, 10, 15, 12, 0),
    },
    {
      title: 'Product Launch',
      start: new Date(2024, 10, 18, 9, 0),
      end: new Date(2024, 10, 18, 11, 0),
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter a title for your event');
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-poppins">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Calendar</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => alert(event.title)}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
