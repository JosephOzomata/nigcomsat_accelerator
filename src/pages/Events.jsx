// src/pages/Events.jsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import  logo  from '../images/Logo/superlogo.png'
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  ChevronRight,
  X,
} from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';

const Events = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 🔥 Firestore — real-time events
  const { data: events, loading } = useFirestoreCollection('events');

  /* ---------- Derived collections ---------- */
  const featuredEvent = useMemo(
    () => events.find((e) => e.featured) || null,
    [events]
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => e.status === 'Upcoming' && !e.featured)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [events]
  );

  const pastEvents = useMemo(
    () =>
      events
        .filter((e) => e.status === 'Completed')
        .sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || '')),
    [events]
  );

  /* ---------- Safe date parsing ---------- */
  const parseEventDate = (event) => {
    if (event.dateISO) {
      const d = new Date(event.dateISO);
      if (!isNaN(d.getTime())) return d;
    }
    const d = new Date(event.date);
    return isNaN(d.getTime()) ? null : d;
  };

  const allEvents = useMemo(() => {
    return events
      .map((e) => ({ ...e, dateObj: parseEventDate(e) }))
      .filter((e) => e.dateObj);
  }, [events]);

  /* ---------- Calendar helpers ---------- */
  const getEventsForDate = (date) => {
    if (!date) return [];
    return allEvents.filter((event) => {
      const d = event.dateObj;
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const hasEvent = (day, month, year) =>
    allEvents.some((event) => {
      const d = event.dateObj;
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasEventOnDay = hasEvent(day, currentMonth, currentYear);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;
      const isTodayDate = isToday(day, currentMonth, currentYear);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-12 flex items-center justify-center cursor-pointer rounded-lg transition-all relative
            ${isSelected ? 'bg-black text-white' : ''}
            ${!isSelected && isTodayDate ? 'bg-gray-100' : ''}
            ${!isSelected && !isTodayDate ? 'hover:bg-gray-50' : ''}
          `}
        >
          <span className="text-sm font-medium">{day}</span>
          {hasEventOnDay && (
            <div
              className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-white' : 'bg-black'
              }`}
            />
          )}
        </div>
      );
    }

    return days;
  };

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl mt-5 md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              Events
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Connect, learn, and innovate at NigComSat's flagship events and programs.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsCalendarOpen(true)}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                View Calendar <Calendar className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCalendarOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
                <h2 className="text-xl font-bold text-gray-900">Event Calendar</h2>
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-black rounded-full" />
                    <span>Event day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-full" />
                    <span>Today</span>
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Events on {monthNames[selectedDate.getMonth()]}{' '}
                      {selectedDate.getDate()}, {selectedDate.getFullYear()}
                    </h4>
                    {getEventsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {getEventsForDate(selectedDate).map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate">
                                {event.title}
                              </h5>
                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-white rounded-full">
                                  {event.description}
                                </span>
                              </div>
                            </div>
                            <button className="px-4 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition">
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No events on this day.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Event</h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200"
          >
            <div className="relative h-64 md:h-auto">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{featuredEvent.date}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <MapPin className="w-4 h-4" />
                <span>{featuredEvent.location}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {featuredEvent.title}
              </h3>
              <p className="text-gray-600 mb-4">{featuredEvent.description}</p>
              {/* <button className="mt-6 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition self-start flex items-center gap-2">
                Register Now <ArrowRight className="w-4 h-4" />
              </button> */}
            </div>
          </motion.div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        </div>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
              <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                View archive <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition"
                >
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <span className="text-xs text-gray-500">{event.date}</span>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      {event.category && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {event.category}
                        </span>
                      )}
                      {event.attendees != null && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {event.attendees}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Events;