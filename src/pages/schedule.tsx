import { Heading, Text, View } from "@go1d/go1d";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { GreedyScheduler } from "~/utils/GreedyScheduler";
import { LearningPlan } from "~/utils/LearningPlan";

export default function Home() {
  const { data: session, status } = useSession();

  const lp = new LearningPlan();
  const start_time = 1701223200
  const duration = 10800
  for(let i = 0; i< 5; i++) {
      lp.addAvailability(start_time + 86400*i, start_time + 86400*i + duration);
  }

  lp.addTask('Task 1', 3600, start_time + 86400*0 + 1800);
  lp.addTask('Task 2', 3600, start_time + 86400*2 + 3600);
  lp.addTask('Task 3', 10801, start_time + 86400*2 + 3600);

  const gs = new GreedyScheduler();
  const sr = gs.schedule(lp);
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
          Schedule
          {sr.schedule.map((scheduledTask, i) => 
            <Text key={'scheduled_task_' + i}>
            {scheduledTask.name} | {new Date(scheduledTask.startTime * 1000).toString()} | {new Date(scheduledTask.endTime * 1000).toString()}
            </Text> 
          )}
          Potentially late
          {sr.deadlinesBreached.map((name, i) => 
            <Text key={'deadline_breached_' + i}>
              {name}
            </Text>
            )}

          Unable to schedule
          {sr.unassignedTasks.map((name, i) => 
            <Text key={'unassigned_task_' + i}>
              {name}
            </Text>
            )}
        </View>
      )}
    </Layout>
  );
}
