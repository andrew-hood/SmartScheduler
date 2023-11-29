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
import React, { useState } from "react";

export default function Preferences({ ...props }) {
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
          onSubmit={(values: any, actions: any) => {
            console.log(values, actions);
            actions.setSubmitting(false);
          }}
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
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={4}
            >
              <View width={200} flexDirection="row" alignItems="center">
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
