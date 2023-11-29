import { Heading, Text, View } from "@go1d/go1d";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <Layout paddingY={6}>
      {status === "authenticated" ? (
        <>
          <Heading visualHeadingLevel="Heading 2" semanticElement="h2">
            Welcome {session?.user?.name}
          </Heading>
          <View
            element="pre"
            css={{ overflowWrap: "anywhere", textWrap: "wrap" }}
          >
            {session.accessToken || "no access token"}
          </View>
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
