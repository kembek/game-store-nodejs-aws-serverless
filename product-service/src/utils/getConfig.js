export const getConfig = () => {
  const region = process.env.AWS_REGION || "";
  const topicArn = process.env.TOPIC_ARN || "SQSQueue";

  return {
    region,
    topicArn,
  };
};
