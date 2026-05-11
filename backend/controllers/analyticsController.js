import StudyPlan from "../models/studyPlanModel.js";


// ===== GET LATEST PLAN =====
const getLatestPlan = async (userId) => {

  const latestPlan = await StudyPlan
    .findOne({ user: userId })
    .sort({ createdAt: -1 });

  return latestPlan;
};


// ===== ANALYTICS =====
export const getAnalytics = async (
  req,
  res
) => {

  try {

    const plan = await getLatestPlan(
      req.params.userId
    );

    if (!plan) {
      return res.json({
        totalTasks: 0,
        completedTasks: 0,
        totalHours: 0,
        subjectStats: {},
      });
    }

    let totalTasks = 0;

    let completedTasks = 0;

    let totalHours = 0;

    let subjectStats = {};

    plan.tasks.forEach((task) => {

      totalTasks++;

      totalHours += Number(task.hours);

      if (task.completed) {
        completedTasks++;
      }

      if (!subjectStats[task.subject]) {
        subjectStats[task.subject] = 0;
      }

      subjectStats[task.subject] += Number(
        task.hours
      );

    });

    res.json({
      totalTasks,
      completedTasks,
      totalHours,
      subjectStats,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ===== PROGRESS =====
export const getProgress = async (
  req,
  res
) => {

  try {

    const plan = await getLatestPlan(
      req.params.userId
    );

    if (!plan) {
      return res.json({
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
      });
    }

    const totalTasks =
      plan.tasks.length;

    const completedTasks =
      plan.tasks.filter(
        (task) => task.completed
      ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (
              completedTasks /
              totalTasks
            ) * 100
          );

    res.json({
      progress,
      completedTasks,
      totalTasks,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ===== STREAK =====
export const getStreak = async (
  req,
  res
) => {

  try {

    const plan = await getLatestPlan(
      req.params.userId
    );

    if (!plan) {
      return res.json({
        streak: 0,
      });
    }

    const streak =
      plan.tasks.filter(
        (task) => task.completed
      ).length;

    res.json({
      streak,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ===== MISSED TASKS =====
export const getMissedTasks = async (
  req,
  res
) => {

  try {

    const plan = await getLatestPlan(
      req.params.userId
    );

    if (!plan) {
      return res.json({
        missedTasks: [],
      });
    }

    const today = new Date();

    const missedTasks =
      plan.tasks.filter((task) => {

        return (
          !task.completed &&
          new Date(task.date) < today
        );

      });

    res.json({
      missedTasks,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};