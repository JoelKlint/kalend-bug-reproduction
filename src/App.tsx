import Kalend, { CalendarEvent, CalendarView } from 'kalend';
import 'kalend/dist/styles/index.css';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FIXED_TIME = DateTime.now()

const STATIC = "1"

// base data which is same across all generating functions
const generateBaseData = (input: DateTime) => {
  const start = input.set({ hour: 8, minute: 0, second: 0, millisecond: 0 })
  const end = input.set({ hour: 11, minute: 0, second: 0, millisecond: 0 })
  return {
    id: `${start.toISO()}-${end.toISO()}`,
    startAt: start.toISO(),
    endAt: end.toISO(),
    color: 'blue',
  }
}

// ✅ Working
const generateStatic = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: STATIC,
  }
}

// ✅ Working
const generateRandom = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: randomName,
  }
}

// ❌ Broken
const generateStaticNull = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: STATIC,
    children: {
      daysView: <CustomDayEvent summary={null} />
    }
  }
}

// ❌ Broken
const generateStaticStatic = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: STATIC,
    children: {
      daysView: <CustomDayEvent summary={STATIC} />
    }
  }
}

// ✅ Working
const generateStaticRandom = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: STATIC,
    children: {
      daysView: <CustomDayEvent summary={randomName} />
    }
  }
}

// ✅ Working
const generateRandomNull = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: randomName,
    children: {
      daysView: <CustomDayEvent summary={null} />
    }
  }
}

// ✅ Working
const generateRandomStatic = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: randomName,
    children: {
      daysView: <CustomDayEvent summary={STATIC} />
    }
  }
}

// ✅ Working
const generateRandomRandom = (input: DateTime): CalendarEvent => {
  const randomName = uuidv4()
  return {
    ...generateBaseData(input),
    summary: randomName,
    children: {
      daysView: <CustomDayEvent summary={randomName} />
    }
  }
}



function App() {
  /**
   *  Current calendar range stored in state to enable data-fetching. Used in this example to trigger a potential re-render
   */
  const [range, setRange] = useState<{ start: DateTime | undefined, end: DateTime | undefined }>({
    start: undefined,
    end: undefined
  })

  const generator = generateStaticNull // TODO: Change which generator-function is used

  const events = [0, 1].map(nr => generator(FIXED_TIME.plus({ days: nr })))

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div>range : {range.start?.toISO()} - {range.end?.toISO()}</div>
      <Kalend
        events={events}
        onEventClick={event => console.log('event clicked')}
        initialDate={DateTime.now().toISO()}
        hourHeight={50}
        disabledViews={[CalendarView.MONTH, CalendarView.THREE_DAYS, CalendarView.DAY]}
        initialView={CalendarView.WEEK}
        showTimeLine
        timeFormat={'24'}
        weekDayStart={'Monday'}
        language={'en'}
        disabledDragging
        showWeekNumbers
        focusHour={8}
        autoScroll
        onPageChange={(e) => {
          setRange({
            start: DateTime.fromISO(e.rangeFrom),
            end: DateTime.fromISO(e.rangeTo),
          })
        }}
      />
    </div>
  );
}

function CustomDayEvent({ summary }: { summary: string | null }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      zIndex: 9999,
    }}>{summary}</div>
  )
}

export default App;
