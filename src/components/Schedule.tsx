import {
  ButtonMinimal,
  Card,
  Heading,
  NotificationContainer,
  NotificationManager,
  Pill,
  Text,
  View,
} from "@go1d/go1d";
import IconCalendar from "@go1d/go1d/build/components/Icons/Calendar";
import { useSession } from "next-auth/react";
import React from "react";
import ApiV3Service from "~/services/api";
import { formatDate, formatTime } from "~/utils/date";
import add from "date-fns/add";
import { saveAs } from "file-saver";
import ical from "ical-generator";
import axios from "axios";

const Cards = ({ cards }: { cards: any[] }) => (
  <View flexDirection="row" gap={3} overflow="scroll" marginTop={3}>
    {cards.map((card: any, index: number) => (
      <Card key={index} href="" appearance="minimal">
        <Card.Image src="" alt="Alt text" />
        <Card.Content>
          <Card.Title>{card.name}</Card.Title>
          <Card.Meta>
            <Card.MetaItem>
              Start Time:{" "}
              {formatTime(
                new Date(
                  card.startTime * 1000 -
                    new Date().getTimezoneOffset() * 60 * 1000
                )
              )}
            </Card.MetaItem>
          </Card.Meta>
          <Card.Meta>
            <Card.MetaItem>
              End Time:{" "}
              {formatTime(
                new Date(
                  card.endTime * 1000 -
                    new Date().getTimezoneOffset() * 60 * 1000
                )
              )}
            </Card.MetaItem>
          </Card.Meta>
        </Card.Content>
      </Card>
    ))}
  </View>
);

export default function Schedule() {
  const { data: session, status } = useSession();

  const schedule = JSON.parse(localStorage.getItem("schedule") || "{}");
  const preferences = JSON.parse(localStorage.getItem("preference") || "{}");

  const dayOfTheWeek = new Date().getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const days = new Array(7).fill(1).map((_, index) => ({
    label: daysOfWeek[(dayOfTheWeek + index) % 7],
    block: null,
    date: add(new Date(), { days: index }),
    tasks: [],
  }));

  Object.keys(preferences).forEach((key: string) => {
    const dayIndex = days.findIndex((day) => day?.label === key);
    (days as any)[dayIndex].block = preferences[key];
  });

  console.log(days);

  schedule?.schedule?.forEach((task: any) => {
    const dayIndex = new Date(task.startTime * 1000).getDay();
    (days as any)[dayIndex].tasks.push(task);
  });

  const getTimeBlockHours = (block: string, date: string) => {
    const startDate = new Date(date);
    switch (block) {
      case "morning":
        startDate.setHours(9, 0, 0);
        break;
      case "midday":
        startDate.setHours(11, 0, 0);
        break;
      case "afternoon":
        startDate.setHours(13, 0, 0);
        break;
      case "night":
        startDate.setHours(18, 0, 0);
        break;
      default:
        startDate.setHours(9, 0, 0);
    }
    const endDate = new Date(startDate.getTime() + 2 * 3600000); // +2 hours
    return { startDate, endDate };
  };

  const handleCalendarEventClick = async (
    eventDate: string,
    timeBlock: string
  ) => {
    const { startDate, endDate } = getTimeBlockHours(timeBlock, eventDate);

    const calendar = ical({ name: "My Learning Schedule" });
    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: "Scheduled Learning Session",
      description: "A dedicated time block for learning.",
      location: "https://go1learning.mygo1.com",
    });

    const icsData = calendar.toString();

    // Send email with the .ics data
    try {
      const response = await axios.post("/api/send-email", {
        icsData,
        email: session?.user.email,
      });

      if (response.status === 200) {
        NotificationManager.success({
          message: (
            <Text>
              <Text fontWeight="semibold">Success!</Text> Calendar event sent.
            </Text>
          ),
          options: {
            lifetime: 3000,
            isOpen: true,
          },
        });
      }
    } catch (error) {
      NotificationManager.danger({
        message: (
          <Text>
            <Text fontWeight="semibold">Error!</Text> Failed to send calendar
            event.
          </Text>
        ),
        options: {
          lifetime: 3000,
          isOpen: true,
        },
      });
    }
    // Save file with ics data
    /*const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const fileName = `event-${Math.random().toString(36).substring(2, 15)}.ics`;
    saveAs(blob, fileName);*/
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
      {days.map((day, index) => (
        <View
          key={day.label}
          backgroundColor="background"
          border={index === 0 ? 3 : 1}
          borderColor={index === 0 ? "accent" : "delicate"}
          padding={[4, 6, 6]}
          borderRadius={3}
          marginBottom={3}
          opacity={!day.block ? "disabled" : undefined}
        >
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <View>
              <Text color="subtle">
                {day.date && formatDate(new Date(day.date))}
              </Text>
              <Heading
                visualHeadingLevel="Heading 3"
                semanticElement="h3"
                marginBottom={3}
              >
                {day.label}
              </Heading>
            </View>
            <View flexDirection="row" alignItems="center" gap={3}>
              {day.block && (
                <View flexDirection="row-reverse">
                  <ButtonMinimal
                    size="sm"
                    icon={IconCalendar}
                    onClick={() =>
                      handleCalendarEventClick(
                        day.date.toISOString(),
                        day.block || ""
                      )
                    }
                  >
                    Send calendar event
                  </ButtonMinimal>
                </View>
              )}
              <Pill>{day.block}</Pill>
            </View>
          </View>
          <View flexDirection="row">
            <View marginTop={4}>
              {day.tasks?.length > 0 ? (
                <Cards cards={day.tasks || []} />
              ) : (
                day.block && (
                  <Text color="subtle">
                    There are no assigned learning scheduled for this day. Find
                    something new on the Go1 platform.
                  </Text>
                )
              )}
            </View>
          </View>
        </View>
      ))}
      <NotificationContainer />
    </View>
  );
}
