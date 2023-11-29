import { Container, Heading, Text, View } from "@go1d/go1d";
import { useSession } from "next-auth/react";
import Schedule from "~/components/Schedule";
import Layout from "~/components/layout";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

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
              gridTemplateColumns: "4fr 1fr",
            }}
          >
            <Schedule />
          </Container>
          {/* <View
            element="pre"
            css={{ overflowWrap: "anywhere", textWrap: "wrap" }}
          >
            {session.accessToken || "no access token"}
          </View> */}
        </>
      )}
    </Layout>
  );
}
