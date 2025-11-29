/*import dayjs from "dayjs"
import { useEffect, useState } from "react"
import type { CalendarEvent } from "../types";
import { getTrainings } from "../trainingapi";
import type { Training } from "../types";
import { retrieveCustomer } from "../customerapi";
import { Calendar, dateFnsLocalizer, dayjsLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import enUS from 'date-fns/locale/en-US';
import { parse } from "uuid";

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
  const [event, setEvents] = useState<CalendarEvent[]>([
    {
      start,
      end,
    },
  ]);

  //hakee harjoitukset ja asiakkaat
    const fetchData = async () => {
      try {
        console.log("fetchData")
        const data = await getTrainings();
        const rawTrainings = data._embedded.trainings;
  
        // Haetaan asiakkaat ja muunnetaan data kalenteriksi
        const TrainingEvents = await Promise.all(rawTrainings.map(async (training: Training) => {
          let customerName = "Unknown";
        
        // Haetaan asiakkaan nimi, jos linkki on olemassa
        if (training._links?.customer) {
          try {
             const customer = await retrieveCustomer(training._links.customer.href);
             customerName = `${customer.firstname} ${customer.lastname}`;
          } catch (e) {
             console.error("Ei asiakasta", e);
          }
        }
        //Lasketaan loppuaika (alkuaika + kesto minuutteina)
        const startDate = new Date(training.date);
        const endDate = dayjs(training.date).add(training.duration, 'minute').toDate();

        return {
          id: training._links.self.href, 
          title: `${training.activity} / ${customerName}`, // Teksti: "Juoksu / Matti Meikäläinen"
          start: startDate,
          end: endDate,
        };
    }));

    setEvents(TrainingEvents);

    } catch (err) {
      console.error(err);
    }
  };
  
    // Kutsutaan tätä funktiota sivun latauksessa
    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }, []);


  return (
    <div>
      <Calendar
      localizer = {localizer}
      events = {event}
      startAccessor = "start"
      endAccessor="end"
      titleAccessor="title"
      views={["month", "week", "day"]}
      defaultView="week"
      />
    </div>
  )
}*/

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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


