import {
  ButtonFilled,
  ButtonMinimal,
  Card,
  Heading,
  Link,
  Pill,
  Text,
  View,
} from "@go1d/go1d";
import IconCalendar from "@go1d/go1d/build/components/Icons/Calendar";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import ApiV3Service from "~/services/api";
import { formatDate, formatTime, getMonday } from "~/utils/date";
import add from "date-fns/add";

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
  const [showCards, setShowCards] = React.useState(false);
  const [cards, setCards] = React.useState([]);

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

  Object.keys(preferences).forEach((value) => {
    const [, day] = value.split("_");
    (days as any)[daysOfWeek.indexOf(day as string)].block = preferences[value];
  });

  schedule.schedule.forEach((task: any) => {
    console.log(new Date(task.startTime * 1000));
    const dayIndex = new Date(task.startTime * 1000).getDay();
    console.log(dayIndex);
    (days as any)[dayIndex].tasks.push(task);
  });

  const api = new ApiV3Service(session?.accessToken as string);
  useEffect(() => {
    api.getEnrolments().then((data) => {
      console.log(data);
      setCards(data.hits);
    });
  }, []);

  console.log(days);

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
          border={index === dayOfTheWeek - 1 ? 3 : 1}
          borderColor={index === dayOfTheWeek - 1 ? "accent" : "delicate"}
          padding={[4, 6, 6]}
          borderRadius={3}
          marginBottom={3}
          opacity={day.block === "none" ? "disabled" : undefined}
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
            <Pill>{day.block}</Pill>
          </View>
          <View flexDirection="row">
            <View marginTop={4}>
              <Text color="subtle">
                Pick up from one of your existing learning
              </Text>
              <Cards cards={day.tasks || []} />
            </View>
          </View>
          <View flexDirection="row-reverse">
            <ButtonMinimal icon={IconCalendar}>
              Send calendar event
            </ButtonMinimal>
          </View>
        </View>
      ))}
    </View>
  );
}
