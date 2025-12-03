import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getTrainings } from "../trainingapi";
import { retrieveCustomer } from "../customerapi";
import type { CalendarEvent, Training } from "../types";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // viikko alkaa maanantaista
  getDay,
  locales,
});

function TrainingCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getTrainings();
        const trainings: Training[] = data._embedded.trainings;

        // Haetaan jokaiselle treenille myös asiakastiedot
        const TrainingEvents: CalendarEvent[] = await Promise.all(
          trainings.map(async (t: Training) => {
            let customerName = "Unknown customer";

            try {
              const customer = await retrieveCustomer(t._links.customer.href);
              customerName = `${customer.firstname} ${customer.lastname}`;
            } catch (err) {
              console.error("Error fetching customer for training", err);
            }

            const start = new Date(t.date);
            const end = new Date(start.getTime() + t.duration * 60000); // duration minuutteina

            return {
              title: `${t.activity}/${customerName}`,
              start,
              end,
            };
          })
        );

        setEvents(TrainingEvents);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div style={{ height: "90vh", width: "100%", padding: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        view={view}
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 600 }}
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );
}

export default TrainingCalendar


