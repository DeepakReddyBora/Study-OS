import StudyPlan from "../models/studyPlanModel.js";


// ===== GET ANALYTICS =====
export const getAnalytics = async (req, res) => {

  try {

    const plans = await StudyPlan.find({
      user: req.params.userId,
    });

    let totalTasks = 0;

    let completedTasks = 0;

    let totalHours = 0;

    let subjectStats = {};

    plans.forEach((plan) => {

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


// ===== GET PROGRESS =====
export const getProgress = async (req, res) => {

  try {

    const plans = await StudyPlan.find({
      user: req.params.userId,
    });

    let totalTasks = 0;

    let completedTasks = 0;

    plans.forEach((plan) => {

      plan.tasks.forEach((task) => {

        totalTasks++;

        if (task.completed) {
          completedTasks++;
        }

      });

    });

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
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


// ===== GET STREAK =====
export const getStreak = async (req, res) => {

  try {

    const plans = await StudyPlan.find({
      user: req.params.userId,
    });

    let streak = 0;

    plans.forEach((plan) => {

      plan.tasks.forEach((task) => {

        if (task.completed) {
          streak++;
        }

      });

    });

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

    const plans = await StudyPlan.find({
      user: req.params.userId,
    });

    let missedTasks = [];

    plans.forEach((plan) => {

      plan.tasks.forEach((task) => {

        const today = new Date();

        const taskDate = new Date(task.date);

        if (
          !task.completed &&
          taskDate < today
        ) {
          missedTasks.push(task);
        }

      });

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