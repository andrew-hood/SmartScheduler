import {
  ButtonFilled,
  Field,
  Form,
  Heading,
  Select,
  SubmitButton,
  Text,
  ToggleSwitch,
  View,
} from "@go1d/go1d";
import {
  add,
  milliseconds,
  startOfDay,
  parseISO,
  startOfWeek,
  addDays,
  format,
  isWithinInterval,
} from "date-fns";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ApiV3Service from "~/services/api";
import { GreedyScheduler } from "~/utils/GreedyScheduler";
import { LearningPlan } from "~/utils/LearningPlan";
import { moveSubsetToBack } from "~/utils/array";
import axios from "axios";
import { useRouter } from "next/router";

type TimeBlockOption = {
  label: string;
  value: string;
};

export default function Preferences({ onSave, ...props }: { onSave: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [method, setMethod] = useState("manual");
  const [preferences, setPreferences] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);

  const methods = [
    {
      label: "Set my schedule",
      value: "manual",
      description:
        "Manually choose your own learning times for each day of the week.",
    },
    {
      label: "Suggest my schedule",
      value: "automatic",
      description:
        "Automatically suggest learning times based on your availability over the next week.",
      recommended: true,
    },
  ];

  const [days, setDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  const timeBlocks = {
    morning: [9, 11],
    midday: [11, 13],
    afternoon: [13, 15],
    evening: [15, 17],
  };

  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem("preference") || "{}");
    Object.keys(days).forEach((day) => {
      (days as any)[day] = day in preferences;
    });
    setDays({ ...days });
    setPreferences(preferences);
  }, []);

  const fetchCalendarData = async (token: string) => {
    try {
      const response = await axios.get("/api/outlook", {
        headers: { Authorization: token },
      });

      const calendarEvents = response.data.map((event: any) => ({
        start: event.start.dateTime,
        end: event.end.dateTime,
      }));

      setCalendarEvents(calendarEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  };

  const getNextDayOfWeek = (date: any, dayOfWeek: any) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = days.indexOf(dayOfWeek);
    const currentDayIndex = date.getDay();
    const daysToAdd =
      dayIndex <= currentDayIndex
        ? 7 - currentDayIndex + dayIndex
        : dayIndex - currentDayIndex;
    return addDays(date, daysToAdd);
  };

  const isTimeBlockOverlapping = (
    dayOfWeek: any,
    startHour: any,
    endHour: any,
    calendarEvents: any
  ) => {
    const dayDate = getNextDayOfWeek(new Date(), dayOfWeek);
    const startTime = new Date(dayDate.setHours(startHour, 0, 0));
    const endTime = new Date(dayDate.setHours(endHour, 0, 0));

    return calendarEvents.some((event: any) => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      return (
        isWithinInterval(startTime, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(endTime, { start: eventStart, end: eventEnd })
      );
    });
  };

  const getAvailableTimeBlocks = (
    day: string,
    calendarEvents: { start: string; end: string }[]
  ): TimeBlockOption[] => {
    const dayDate = getNextDayOfWeek(new Date(), day);

    return Object.entries(timeBlocks).reduce<TimeBlockOption[]>(
      (availableBlocks, [block, [startHour, endHour]]) => {
        if (
          !isTimeBlockOverlapping(day, startHour!, endHour!, calendarEvents)
        ) {
          availableBlocks.push({
            label: block.charAt(0).toUpperCase() + block.slice(1),
            value: block,
          });
        }
        return availableBlocks;
      },
      []
    );
  };

  const isOverlappingWithEvents = (
    day: any,
    timeBlock: any,
    calendarEvents: any
  ) => {
    const dayDate = new Date(day);
    let startTime: any, endTime: any;

    switch (timeBlock) {
      case "morning":
        startTime = new Date(dayDate.setHours(9, 0, 0)); // 9am
        endTime = new Date(dayDate.setHours(10, 0, 0)); // 10am
        break;
      case "midday":
        startTime = new Date(dayDate.setHours(12, 0, 0)); // 12pm
        endTime = new Date(dayDate.setHours(13, 0, 0)); // 1pm
        break;
      case "afternoon":
        startTime = new Date(dayDate.setHours(15, 0, 0)); // 3pm
        endTime = new Date(dayDate.setHours(16, 0, 0)); // 4pm
        break;
      default:
        startTime = new Date(dayDate.setHours(18, 0, 0)); // 6pm
        endTime = new Date(dayDate.setHours(19, 0, 0)); // 7pm
        break;
    }

    return calendarEvents.some((event: any) => {
      const eventStart = parseISO(event.start);
      const eventEnd = parseISO(event.end);
      return (
        isWithinInterval(startTime, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(endTime, { start: eventStart, end: eventEnd })
      );
    });
  };

  useEffect(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      setCalendarEvents(events);
    }
  }, []);

  useEffect(() => {
    const token = router.query.token;
    if (token && typeof token === "string") {
      localStorage.setItem("aztoken", token);
      setMethod("automatic");
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("aztoken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchCalendarData(accessToken);
    }
  }, [accessToken]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleLogout = () => {
    localStorage.removeItem("aztoken");
    localStorage.removeItem("calendarEvents");
    setAccessToken("");
    setCalendarEvents([]);
  };

  const handleSubmitForm = async (values: any, actions: any) => {
    Object.keys(values).forEach((day) => {
      if (!(days as any)[day as string]) {
        delete values[day];
      }
    });

    const lp = new LearningPlan();

    const dayOfTheWeek = new Date().getDay();
    const orderedDays = moveSubsetToBack(daysOfWeek, 0, dayOfTheWeek);

    Object.keys(values).forEach((day) => {
      const dayIndex = orderedDays.indexOf(day as string);
      const date = startOfDay(add(new Date(), { days: dayIndex }));

      let startTime, endTime;
      switch (values[day]) {
        case "morning":
          startTime = new Date(date.setHours(9, 0, 0)).getTime(); // 9am
          endTime = new Date(date.setHours(10, 0, 0)).getTime(); // 10am
          break;
        case "midday":
          startTime = new Date(date.setHours(12, 0, 0)).getTime(); // 12pm
          endTime = new Date(date.setHours(13, 0, 0)).getTime(); // 1pm
          break;
        case "afternoon":
          startTime = new Date(date.setHours(15, 0, 0)).getTime(); // 3pm
          endTime = new Date(date.setHours(16, 0, 0)).getTime(); // 4pm
          break;
        default:
          startTime = new Date(date.setHours(18, 0, 0)).getTime(); // 6pm
          endTime = new Date(date.setHours(19, 0, 0)).getTime(); // 7pm
          break;
      }

      lp.addAvailability(startTime, endTime);
    });

    // get assigned learning

    const api = new ApiV3Service(session?.accessToken as string);
    const tasks = await api.getAssignedLearning(session?.user.id as string);
    tasks.forEach((task: any) => {
      lp.addTask(
        JSON.stringify(task),
        milliseconds({ minutes: 30 }),
        task.due_date
          ? new Date(task.due_date).getTime()
          : add(new Date(), { years: 1 }).getTime()
      );
    });

    const gs = new GreedyScheduler();
    const sr = gs.schedule(lp);

    localStorage.setItem("preference", JSON.stringify(values));
    localStorage.setItem("schedule", JSON.stringify(sr));

    onSave && onSave([values, sr]);

    actions.setSubmitting(false);
  };

  return (
    <View
      backgroundColor="background"
      border={1}
      borderColor="delicate"
      padding={[4, 5, 5]}
      marginBottom={4}
      borderRadius={3}
      {...props}
    >
      <Heading
        visualHeadingLevel="Heading 4"
        semanticElement="h4"
        marginBottom={3}
      >
        Finding time for your learning
      </Heading>
      <View
        display={["flex", "flex", "grid"]}
        gap={4}
        css={{
          gridTemplateColumns: "1fr 1fr",
        }}
        marginBottom={6}
      >
        {methods.map((type) => (
          <View
            key={type.value}
            borderColor={method === type.value ? "accent" : "delicate"}
            border={2}
            borderRadius={3}
            padding={4}
            onClick={() => setMethod(type.value)}
            css={{ cursor: "pointer" }}
          >
            <Heading
              visualHeadingLevel="Heading 4"
              semanticElement="h4"
              marginBottom={3}
            >
              {type.label}
            </Heading>
            <Text fontSize={1}>{type.description}</Text>
          </View>
        ))}
      </View>

      {method === "automatic" && (
        <View>
          <Heading
            visualHeadingLevel="Heading 4"
            semanticElement="h4"
            marginBottom={3}
          >
            {accessToken ? "Calendar connected" : "Connect your calendar"}
          </Heading>
          {!accessToken ? (
            <ButtonFilled size="lg" width={300} href="/api/az-auth/login">
              Login to Microsoft
            </ButtonFilled>
          ) : (
            <ButtonFilled size="lg" width={300} onClick={handleLogout}>
              Logout from Microsoft
            </ButtonFilled>
          )}
          {accessToken && preferences && (
            <View marginTop={5}>
              <Form initialValues={preferences} onSubmit={handleSubmitForm}>
                <Heading
                  visualHeadingLevel="Heading 4"
                  semanticElement="h4"
                  marginBottom={3}
                >
                  Recommended learning slots based on your existing calendar
                </Heading>
                {Object.keys(days).map((day) => {
                  const availableBlocks = getAvailableTimeBlocks(
                    day,
                    calendarEvents
                  );

                  const isDisabled = availableBlocks.length === 0;
                  const toggleValue = isDisabled ? false : (days as any)[day];

                  return (
                    <View
                      key={day}
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom={4}
                    >
                      <View width={160} flexDirection="row" alignItems="center">
                        <ToggleSwitch
                          disabled={isDisabled}
                          size="md"
                          label={day}
                          value={toggleValue}
                          css={{ cursor: "default" }}
                          onChange={(e: any) => {
                            setDays({ ...days, [day]: e.target.checked });
                          }}
                        />
                      </View>

                      <Field
                        id={`${day}`}
                        name={`${day}`}
                        component={Select}
                        width={150}
                        defaultValue="none"
                        options={[
                          { label: "None", value: "none" },
                          ...availableBlocks,
                        ]}
                        disabled={!(days as any)[day]}
                        required
                      />
                    </View>
                  );
                })}
                <View flexDirection="row-reverse">
                  <SubmitButton>Submit</SubmitButton>
                </View>
              </Form>
            </View>
          )}
        </View>
      )}

      {method === "manual" && preferences && (
        <Form initialValues={preferences} onSubmit={handleSubmitForm}>
          <Heading
            visualHeadingLevel="Heading 4"
            semanticElement="h4"
            marginBottom={3}
          >
            Set your available hours for each day of the week
          </Heading>
          {Object.keys(days).map((day) => (
            <View
              key={day}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={4}
            >
              <View width={160} flexDirection="row" alignItems="center">
                <ToggleSwitch
                  size="md"
                  label={day}
                  value={(days as any)[day]}
                  css={{ cursor: "default" }}
                  onChange={(e: any) => {
                    setDays({ ...days, [day]: e.target.checked });
                  }}
                />
              </View>

              <Field
                id={`${day}`}
                name={`${day}`}
                component={Select}
                width={150}
                defaultValue="none"
                options={[
                  {
                    label: "None",
                    value: "none",
                  },
                  {
                    label: "Morning",
                    value: "morning",
                  },
                  {
                    label: "Midday",
                    value: "midday",
                  },
                  {
                    label: "Afternoon",
                    value: "afternoon",
                  },
                  {
                    label: "Evening",
                    value: "evening",
                  },
                ]}
                disabled={!(days as any)[day]}
                required
              />
            </View>
          ))}
          <View flexDirection="row-reverse">
            <SubmitButton>Submit</SubmitButton>
          </View>
        </Form>
      )}
    </View>
  );
}
