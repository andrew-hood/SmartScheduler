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
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ApiV3Service from "~/services/api";
import { GreedyScheduler } from "~/utils/GreedyScheduler";
import { LearningPlan } from "~/utils/LearningPlan";
import { getMonday } from "~/utils/date";

export default function Preferences({ ...props }) {
  const { data: session } = useSession();
  const [method, setMethod] = useState("automatic");
  const methods = [
    {
      label: "Via Calendar",
      value: "automatic",
      description:
        "You can automatically block out times based on your availability in your calendar.",
      recommended: true,
    },
    {
      label: "Manual",
      value: "manual",
      description: "You can manually block out times for each day of the week.",
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

    const lp = new LearningPlan();

    Object.keys(values).forEach((key) => {
      const [, day] = key.split("_");
      const dayIndex = daysOfWeek.indexOf(day as string);
      const date = getMonday(new Date(), dayIndex);

      let startTime, endTime;
      switch (values[key]) {
        case "morning":
          startTime = date.getTime() / 1000 + 9 * 3600; // 9am
          endTime = startTime + 10 * 3600; // 10am
          break;
        case "midday":
          startTime = date.getTime() / 1000 + 11 * 3600; // 11am
          endTime = startTime + 2 * 3600; // 1pm
          break;
        case "afternoon":
          startTime = date.getTime() / 1000 + 13 * 3600; // 1pm
          endTime = startTime + 2 * 3600; // 3pm
          break;
        default:
          startTime = date.getTime() / 1000 + 15 * 3600; // 3pm
          endTime = startTime + 2 * 3600; // 5pm
          break;
      }

      lp.addAvailability(startTime, endTime);
    });

    // get assigned learning

    const api = new ApiV3Service(session?.accessToken as string);
    const tasks = await api.getAssignedLearning(session?.user.id as string);

    console.log(tasks);
    tasks.forEach((task: any) => {
      lp.addTask(
        task.lo?.title || task.lo_id,
        1800,
        new Date(task.due_date * 1000).getTime() / 1000
      );
    });

    const gs = new GreedyScheduler();
    const sr = gs.schedule(lp);

    console.log();
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
            Login to your calendar
          </Heading>
          <ButtonFilled size="lg" width={300}>
            Login to Microsoft
          </ButtonFilled>
        </View>
      )}

      {method === "manual" && (
        <Form
          initialValues={{
            block_Monday: "morning",
            block_Tuesday: "morning",
            block_Wednesday: "morning",
            block_Thursday: "morning",
            block_Friday: "morning",
          }}
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
                id={`block_${day}`}
                name={`block_${day}`}
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
