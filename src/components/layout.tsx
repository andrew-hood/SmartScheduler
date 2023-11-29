import {
  Avatar,
  BaseProps,
  Button,
  ButtonFilled,
  Container,
  Heading,
  View,
} from "@go1d/go1d";
import IconLogout from "@go1d/go1d/build/components/Icons/Logout";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { env } from "~/env.mjs";

function UserMenu() {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <View flexDirection="row" alignItems="center">
          <Button icon={IconLogout} onClick={signOut}>
            Logout
          </Button>
          <Avatar fullName={session.user.name} scaleSize={1} />
        </View>
      ) : (
        <ButtonFilled color="accent" href="/api/auth/signin">
          Login
        </ButtonFilled>
      )}
    </>
  );
}

const navigation = [{ href: "/about", label: "About" }];

export default function Layout({
  title = env.NEXT_PUBLIC_GO1_CLIENT_NAME,
  children,
  ...props
}: React.PropsWithChildren<{ title?: string } & BaseProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <View
        backgroundColor="background"
        justifyContent="center"
        borderBottom={1}
        borderColor="soft"
        paddingY={4}
      >
        <Container
          contain="wide"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingX={[4, 4, 0]}
        >
          <View flexDirection="row" alignItems="center" gap={3}>
            <Heading
              semanticElement="h1"
              visualHeadingLevel="Heading 4"
              marginRight={3}
            >
              <Link href="/">{title}</Link>
            </Heading>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button>{item.label}</Button>
              </Link>
            ))}
          </View>
          <View>
            <UserMenu />
          </View>
        </Container>
      </View>

      <Container contain="wide" paddingX={[4, 4, 0]} {...props}>
        {children}
      </Container>
    </>
  );
}
