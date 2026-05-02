const optimizeTasks = (tasks, maxHours) => {
  const n = tasks.length;

  const dp = Array(maxHours + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const { duration, score } = tasks[i];

    for (let w = maxHours; w >= duration; w--) {
      dp[w] = Math.max(dp[w], dp[w - duration] + score);
    }
  }

  return dp[maxHours];
};

module.exports = optimizeTasks;