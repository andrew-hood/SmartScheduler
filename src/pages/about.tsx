import {
  ButtonFilled,
  Container,
  Field,
  Form,
  Heading,
  Text,
  TextArea,
  TextInput,
  View,
} from "@go1d/go1d";
import Layout from "~/components/layout";

export default function AboutPage() {
  return (
    <Layout contain="full">
      <View
        height={300}
        width="100%"
        css={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1687042277586-971369d3d241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80)",
        }}
      />

      <Container
        contain="wide"
        backgroundColor="background"
        padding={4}
        borderRadius={4}
        border={1}
        borderColor="delicate"
        marginTop={4}
        display={["flex", "grid"]}
        gap={8}
        css={{
          gridTemplateColumns: "1fr 1fr",
        }}
      ></Container>
    </Layout>
  );
}
