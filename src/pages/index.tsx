import {
  Accordion,
  ButtonFilled,
  Container,
  Heading,
  SpotIcon,
  Text,
  View,
} from "@go1d/go1d";
import { useSession } from "next-auth/react";
import Preferences from "~/components/Preferences";
import Schedule from "~/components/Schedule";
import Layout from "~/components/layout";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const updateSchedule = () => {
    window.location.reload();
  };

  return (
    <Layout contain="full">
      {status === "authenticated" && (
        <>
          <View backgroundColor="accent" color="background">
            <Container contain="wide" marginY={[6, 8, 8]} paddingX={[4, 0, 0]}>
              <Heading visualHeadingLevel="Heading 2" semanticElement="h2">
                Welcome back,
              </Heading>
              <Heading visualHeadingLevel="Heading 1" semanticElement="h1">
                {session.user?.name}
              </Heading>
            </Container>
          </View>
          <Container
            contain="wide"
            marginY={[2, 4, 6]}
            paddingX={[4, 0, 0]}
            display={["flex", "flex", "grid"]}
            gap={5}
            alignItems={["flex", "flex", "flex-start"]}
            css={{
              gridTemplateColumns: "3fr 2fr",
            }}
          >
            <Schedule />
            <View>
              <Preferences onSave={updateSchedule} />
              <View
                border={1}
                borderColor="delicate"
                backgroundColor="background"
                borderRadius={3}
                padding={5}
              >
                <SpotIcon name="FillInBlankQuestion" size={8} />
                <Heading
                  visualHeadingLevel="Heading 4"
                  semanticElement="h4"
                  marginTop={4}
                >
                  Need help?
                </Heading>
                <Text>Try our new automatic meeting scheduler!</Text>
                <ButtonFilled marginTop={4}>Build my planner</ButtonFilled>
              </View>
            </View>
          </Container>
        </>
      )}
    </Layout>
  );
}
