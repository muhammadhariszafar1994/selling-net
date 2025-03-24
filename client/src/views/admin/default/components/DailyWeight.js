import moment from "moment";

export const dailyWeight = (weights) => {
  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "days").startOf("day");

  let totalWeight = 0;
  let label = "";

  const todayWeight = weights
    .filter((item) => moment(item.createdAt).isSame(today, "day"))
    .reduce((sum, item) => sum + item.truckWeight, 0);

  if (todayWeight > 0) {
    totalWeight = todayWeight;
    label = "Today";
  } else {
    const yesterdayWeight = weights
      .filter((item) => moment(item.createdAt).isSame(yesterday, "day"))
      .reduce((sum, item) => sum + item.truckWeight, 0);

    if (yesterdayWeight > 0) {
      totalWeight = yesterdayWeight;
      label = "Yesterday";
    } else {
      const olderWeights = weights.filter((item) =>
        moment(item.createdAt).isBefore(yesterday, "day")
      );

      if (olderWeights.length > 0) {
        const olderWeight = olderWeights.reduce(
          (sum, item) => sum + item.truckWeight,
          0
        );
        totalWeight = olderWeight;
        label = moment(olderWeights[0].createdAt).format("MMM DD, YYYY");
      }
    }
  }
//   console.log("totalWeight: " + totalWeight)
  return { totalWeight, label };
};
