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
import { formatDate, getMonday } from "~/utils/date";
import { saveAs } from "file-saver";
import ical from "ical-generator";

const Cards = ({ cards }: { cards: any[] }) => (
  <View flexDirection="row" gap={3} overflow="scroll" marginTop={3}>
    {cards.map((card: any) => (
      <Card key={card.id} href="" appearance="minimal">
        <Card.Image src={card.core.image} alt="Alt text" />
        <Card.Content>
          <Card.Title>{card.core.title}</Card.Title>
          <Card.Meta>
            <Card.MetaItem>{card.core.type}</Card.MetaItem>
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

  const handleCalendarEventClick = (eventDate: string, timeBlock: string) => {
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
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const fileName = `event-${Math.random().toString(36).substring(2, 15)}.ics`;
    saveAs(blob, fileName);
  };

  const api = new ApiV3Service(session?.accessToken as string);
  useEffect(() => {
    api.getEnrolments().then((data) => {
      console.log(data);
      setCards(data.hits);
    });
  }, []);

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
            <View flexDirection="row">
              {showCards ? (
                <View marginTop={4}>
                  <Text color="subtle">
                    Pick up from one of your existing learning
                  </Text>
                  <Cards cards={cards} />
                </View>
              ) : (
                <ButtonFilled color="accent" onClick={() => setShowCards(true)}>
                  Continue
                </ButtonFilled>
              )}
            </View>
          ) : (
            (days as any)[day].block !== "none" && (
              <View flexDirection="row-reverse">
                <ButtonMinimal
                  icon={IconCalendar}
                  onClick={() =>
                    handleCalendarEventClick(
                      (days as any)[day].date,
                      (days as any)[day].block
                    )
                  }
                >
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
