import { ButtonFilled, Heading, SpotIcon, Text, View } from "@go1d/go1d";
import { useSession } from "next-auth/react";
import Preferences from "~/components/Preferences";
import Layout from "~/components/layout";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <Layout paddingY={6}>
      {status === "authenticated" ? (
        <>
          <Heading visualHeadingLevel="Heading 2" semanticElement="h2">
            Welcome,
          </Heading>
          <Heading visualHeadingLevel="Heading 1" semanticElement="h1">
            {session.user?.name}
          </Heading>
          <View
            flexDirection="row"
            marginTop={6}
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Preferences width={["100%", "100%", "75%"]} />
            <View
              border={1}
              borderColor="delicate"
              backgroundColor="background"
              borderRadius={3}
              padding={6}
              width="23%"
              display={["none", "none", "flex"]}
            >
              <SpotIcon name="FillInBlankQuestion" size={8} />
              <Heading
                visualHeadingLevel="Heading 4"
                semanticElement="h4"
                marginTop={4}
              >
                Need help?
              </Heading>
              <Text>Try our new AI powered meeting scheduler!</Text>
              <ButtonFilled marginTop={4}>Build my planner</ButtonFilled>
            </View>
          </View>
          {/* <View
            element="pre"
            css={{ overflowWrap: "anywhere", textWrap: "wrap" }}
          >
            {session.accessToken || "no access token"}
          </View> */}
        </>
      ) : (
        <View
          border={3}
          borderColor="delicate"
          height={400}
          width="100%"
          alignItems="center"
          justifyContent="center"
          css={{
            borderStyle: "dashed",
          }}
        >
          <Text>
            Unauthenticated content. View the README.md to get started.
          </Text>
        </View>
      )}
    </Layout>
  );
}
