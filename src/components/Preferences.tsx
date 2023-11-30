import {
  ButtonFilled,
  Field,
  Form,
  Heading,
  Pill,
  Select,
  SubmitButton,
  Text,
  ToggleSwitch,
  View,
} from "@go1d/go1d";
import { add } from "date-fns";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ApiV3Service from "~/services/api";
import { GreedyScheduler } from "~/utils/GreedyScheduler";
import { LearningPlan } from "~/utils/LearningPlan";
import { getMonday } from "~/utils/date";

export default function Preferences({ ...props }) {
  const { data: session } = useSession();
  const [method, setMethod] = useState("automatic");
  const [preferences, setPreferences] = useState({} as any);
  const methods = [
    {
      label: "Suggest my schedule",
      value: "automatic",
      description:
        "Automatically suggest learning times based on your availability over the next week.",
      recommended: true,
    },
    {
      label: "Set my schedule",
      value: "manual",
      description: "Manually choose your own learning times for each day of the week.",
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
    console.log(values, actions);
    Object.keys(values).forEach((day) => {
      if (!(days as any)[day as string]) {
        delete values[day];
      }
    });

    const lp = new LearningPlan();

    Object.keys(values).forEach((day) => {
      const dayIndex = daysOfWeek.indexOf(day as string);
      const date = getMonday(add(new Date(), {days: 1}), dayIndex);

      let startTime, endTime;
      switch (values[day]) {
        case "morning":
          startTime = add(date, {hours: 9}).getTime(); // 9am
          endTime = add(date, {hours: 11}).getTime(); // 11am
          break;
        case "midday":
          startTime = add(date, {hours: 11}).getTime(); // 11am
          endTime = add(date, {hours: 13}).getTime(); // 1pm
          break;
        case "afternoon":
          startTime = add(date, {hours: 13}).getTime(); // 1pm
          endTime = add(date, {hours: 15}).getTime(); // 3pm
          break;
        default:
          startTime = add(date, {hours: 15}).getTime(); // 3pm
          endTime = add(date, {hours: 17}).getTime(); // 5pm
          break;
      }

      lp.addAvailability(startTime, endTime);
      console.log(startTime, new Date(startTime));
      console.log(endTime, new Date(endTime));
    });

    console.log(lp.getAvailabilities());

    // get assigned learning

    const api = new ApiV3Service(session?.accessToken as string);
    const tasks = await api.getAssignedLearning(session?.user.id as string);
    console.log(tasks);
    tasks.forEach((task: any) => {
      lp.addTask(
        JSON.stringify(task),
        1800 * 1000,
        task.due_date
          ? new Date(task.due_date).getTime()
          : add(new Date(), { years: 1 }).getTime()
      );
    });

    const gs = new GreedyScheduler();
    const sr = gs.schedule(lp);

    console.log(sr);

    localStorage.setItem("preference", JSON.stringify(values));
    localStorage.setItem("schedule", JSON.stringify(sr));

    actions.setSubmitting(false);
  };

  return (
    <View
      backgroundColor="background"
      border={1}
      borderColor="delicate"
      padding={[4, 6, 6]}
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
        flexDirection={["column", "column", "row"]}
        gap={[3, 4, 5]}
        marginBottom={8}
      >
        {methods.map((type) => (
          <View
            key={type.value}
            borderColor={method === type.value ? "accent" : "delicate"}
            border={2}
            borderRadius={3}
            padding={4}
            flexBasis={0.49}
            onClick={() => setMethod(type.value)}
            css={{ cursor: "pointer" }}
          >
            <Heading
              visualHeadingLevel="Heading 4"
              semanticElement="h4"
              marginBottom={3}
            >
              {type.label}
              {type.recommended && <Pill marginLeft={3}>Recommended</Pill>}
            </Heading>
            <Text>{type.description}</Text>
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

      {method === "manual" && (
        <Form
          initialValues={
            preferences || {
              Monday: "morning",
              Tuesday: "morning",
              Wednesday: "morning",
              Thursday: "morning",
              Friday: "morning",
              Saturday: "morning",
              Sunday: "morning",
            }
          }
          onSubmit={handleSubmitForm}
        >
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
                defaultValue="morning"
                options={[
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
