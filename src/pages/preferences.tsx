import {
  ButtonFilled,
  Container,
  Field,
  Form,
  Heading,
  SpotIcon,
  Text,
  TextArea,
  TextInput,
  View,
} from "@go1d/go1d";
import Preferences from "~/components/Preferences";
import Layout from "~/components/layout";

export default function AboutPage() {
  return (
    <Layout contain="full">
      <Container
        contain="wide"
        marginY={6}
        paddingX={[4, 0, 0]}
        display={["flex", "flex", "grid"]}
        gap={5}
        alignItems={["flex", "flex", "flex-start"]}
        css={{
          gridTemplateColumns: "4fr 1fr",
        }}
      >
        <Preferences />
        <View
          border={1}
          borderColor="delicate"
          backgroundColor="background"
          borderRadius={3}
          padding={6}
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
      </Container>
    </Layout>
  );
}
