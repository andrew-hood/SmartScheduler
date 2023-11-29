import {
  ButtonFilled,
  ButtonMinimal,
  Heading,
  Pill,
  Text,
  View,
} from "@go1d/go1d";
import IconCalendar from "@go1d/go1d/build/components/Icons/Calendar";
import React from "react";

function getMonday(d: any, offset = 0) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + offset + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function formatDate(d: Date) {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

export default function Schedule() {
  const dayOfTheWeek = new Date().getDay();
  const days = {
    Monday: {
      block: "morning",
      date: getMonday(new Date()),
    },
    Tuesday: { block: "morning", date: getMonday(new Date(), 1) },
    Wednesday: { block: "afternoon", date: getMonday(new Date(), 2) },
    Thursday: { block: "morning", date: getMonday(new Date(), 3) },
    Friday: { block: "midday", date: getMonday(new Date(), 4) },
    Saturday: { block: "none", date: getMonday(new Date(), 5) },
    Sunday: { block: "none", date: getMonday(new Date(), 6) },
  };

  return (
    <View marginY={6}>
      <Heading
        visualHeadingLevel="Heading 4"
        semanticElement="h4"
        marginBottom={3}
      >
        This week's schedule
      </Heading>
      {Object.keys(days).map((day, index) => (
        <View
          key={day}
          backgroundColor="background"
          border={index === dayOfTheWeek - 1 ? 3 : 1}
          borderColor={index === dayOfTheWeek - 1 ? "accent" : "delicate"}
          padding={[4, 6, 6]}
          borderRadius={3}
          marginBottom={3}
          opacity={(days as any)[day].block === "none" ? "disabled" : undefined}
        >
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <View>
              <Text color="subtle">
                {(days as any)[day].date &&
                  formatDate(new Date((days as any)[day].date))}
              </Text>
              <Heading
                visualHeadingLevel="Heading 3"
                semanticElement="h3"
                marginBottom={3}
              >
                {day}
              </Heading>
            </View>
            <Pill>{(days as any)[day].block}</Pill>
          </View>
          {index === dayOfTheWeek - 1 ? (
            <View flexDirection="row" gap={3}>
              <ButtonFilled color="accent">Start</ButtonFilled>
            </View>
          ) : (
            (days as any)[day].block !== "none" && (
              <View flexDirection="row-reverse">
                <ButtonMinimal icon={IconCalendar}>
                  Send calendar event
                </ButtonMinimal>
              </View>
            )
          )}
        </View>
      ))}
    </View>
  );
}
