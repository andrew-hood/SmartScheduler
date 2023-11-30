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
import { add, milliseconds, startOfDay } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ApiV3Service from "~/services/api";
import { GreedyScheduler } from "~/utils/GreedyScheduler";
import { LearningPlan } from "~/utils/LearningPlan";

export default function Preferences({ onSave, ...props }: { onSave: any }) {
  const { data: session } = useSession();
  const [method, setMethod] = useState("manual");
  const [preferences, setPreferences] = useState(null);
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

  useEffect(() => {
    const preferences = JSON.parse(localStorage.getItem("preference") || "{}");
    Object.keys(days).forEach((day) => {
      (days as any)[day] = day in preferences;
    });
    setDays({ ...days });
    setPreferences(preferences);
  }, []);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
          startTime = add(date, { hours: 9 }).getTime(); // 9am
          endTime = add(date, { hours: 11 }).getTime(); // 11am
          break;
        case "midday":
          startTime = add(date, { hours: 11 }).getTime(); // 11am
          endTime = add(date, { hours: 13 }).getTime(); // 1pm
          break;
        case "afternoon":
          startTime = add(date, { hours: 13 }).getTime(); // 1pm
          endTime = add(date, { hours: 15 }).getTime(); // 3pm
          break;
        default:
          startTime = add(date, { hours: 15 }).getTime(); // 3pm
          endTime = add(date, { hours: 17 }).getTime(); // 5pm
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
        How would you like to select when you are available?
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
            Connect your calendar
          </Heading>
          <ButtonFilled size="lg" width={300}>
            Login to Microsoft
          </ButtonFilled>
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
