import {
  ButtonFilled,
  Field,
  Form,
  Heading,
  TextInput,
  View,
} from "@go1d/go1d";
import { getProviders, signIn } from "next-auth/react";
import { env } from "~/env.mjs";
import { getServerAuthSession } from "~/server/auth";

interface Provider {
  id: string;
  name: string;
  type: string;
}

function OauthProvider({ provider }: { provider: Provider }) {
  return (
    <ButtonFilled onClick={() => signIn(provider.id)}>
      Login with {provider.name}
    </ButtonFilled>
  );
}

function CredentialsProvider({ provider }: { provider: Provider }) {
  return (
    <Form
      initialValues={{ name: "" }}
      onSubmit={(values: any) =>
        signIn(provider.id, {
          username: values.username,
          password: values.password,
        })
      }
    >
      <Field label="Username" name="username" component={TextInput} required />
      <Field
        label="Password"
        name="password"
        component={TextInput}
        type="password"
        required
      />
      <ButtonFilled type="submit" color="accent">
        Login with {provider.name}
      </ButtonFilled>
    </Form>
  );
}

export default function LoginPage({ providers }: { providers: Provider[] }) {
  return (
    <View
      backgroundColor="background"
      height="100vh"
      width="100%"
      display={["flex", "grid"]}
      css={{
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <View
        css={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80)",
        }}
      />
      <View
        width={400}
        maxWidth="100%"
        marginX="auto"
        justifyContent="center"
        padding={4}
        gap={6}
      >
        <Heading visualHeadingLevel="Heading 3" semanticElement="h3">
          {env.NEXT_PUBLIC_GO1_CLIENT_NAME}
        </Heading>
        {Object.values(providers).map((provider: any) => (
          <View key={provider.id}>
            {provider.type === "credentials" ? (
              <CredentialsProvider provider={provider} />
            ) : (
              <OauthProvider provider={provider} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerAuthSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: ctx.query.callbackUrl || "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
