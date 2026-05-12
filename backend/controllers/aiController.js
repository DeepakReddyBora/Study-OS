import openai from "../config/openrouter.js";
import StudyPlan from "../models/studyPlanModel.js";

// Generate Study Plan
export const generateStudyPlan = async (req, res) => {
  try {
    const { userId, subjects, hoursPerDay, days } = req.body;

    // 1. Ensure subjects are formatted as a clear list
    const subjectList = Array.isArray(subjects) ? subjects.join(", ") : subjects;

    const prompt = `
You are a study planning API that returns ONLY raw JSON.

STRICT RULES:
1. Use ONLY these subjects: ${subjectList}
2. Create a ${days}-day study plan.
3. Allocate exactly ${hoursPerDay} hours of study per day.
4. Do NOT include any subjects not listed above.

Return ONLY JSON in this format:
[
  {
   "day": 1,
   "tasks": [
     {"subject": "Subject Name from list", "hours": 2}
   ]
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { 
          role: "system", 
          content: "You are a precise study plan generator. You never invent new subjects. You only use the subjects provided by the user." 
        },
        { role: "user", content: prompt }
      ],
      // Adding temperature: 0 makes the model more deterministic and less likely to wander
      temperature: 0.1 
    });

    const result = completion.choices[0].message.content;

    const jsonMatch = result.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      return res.status(400).json({ message: "AI did not return valid JSON" });
    }

    const planJSON = JSON.parse(jsonMatch[0]);

    const studyPlan = await StudyPlan.create({
      userId,
      plan: planJSON
    });

    res.json(studyPlan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Study Plan
export const getStudyPlan = async (req, res) => {
  try {

    const { userId } = req.params;

    const plan = await StudyPlan.findOne({ userId });

    if (!plan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    res.json(plan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {

    const { planId, day, taskIndex } = req.body;

    const plan = await StudyPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    const task = plan.plan[day - 1].tasks[taskIndex];

    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await plan.save();

    res.json({
      message: "Task updated",
      plan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudyProgress = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    studyPlan.plan.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;

        if (task.completed) {
          completedTasks++;
        }
      });
    });

    const progress = Math.round((completedTasks / totalTasks) * 100);

    res.json({
      completedTasks,
      totalTasks,
      progress
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getStudyStreak = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    const completedDates = [];

    studyPlan.plan.forEach(day => {
      day.tasks.forEach(task => {
        if (task.completed && task.completedAt) {
          const date = new Date(task.completedAt)
            .toISOString()
            .split("T")[0];

          completedDates.push(date);
        }
      });
    });

    const uniqueDates = [...new Set(completedDates)].sort().reverse();

    let streak = 0;
    let today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {

      const date = new Date(uniqueDates[i]);
      const diff = Math.floor(
        (today - date) / (1000 * 60 * 60 * 24)
      );

      if (diff === streak) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      streak
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getMissedTasks = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    const missedTasks = [];

    studyPlan.plan.forEach(day => {

      day.tasks.forEach(task => {

        if (!task.completed) {
          missedTasks.push({
            day: day.day,
            subject: task.subject,
            hours: task.hours
          });
        }

      });

    });

    res.json({
      missedTasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const rescheduleMissedTasks = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    const missedTasks = [];

    // collect missed tasks
    studyPlan.plan.forEach(day => {
      day.tasks.forEach(task => {
        if (!task.completed) {
          missedTasks.push({
            subject: task.subject,
            hours: task.hours
          });
        }
      });
    });

    if (missedTasks.length === 0) {
      return res.json({
        message: "No missed tasks to reschedule"
      });
    }

    const prompt = `
Redistribute the following missed study tasks into future days.

Tasks:
${JSON.stringify(missedTasks)}

Return ONLY JSON in this format:

[
 {"day":5,"subject":"DBMS","hours":2},
 {"day":6,"subject":"CN","hours":1}
]
`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const result = completion.choices[0].message.content;

    // SAFE JSON extraction
    const start = result.indexOf("[");
    const end = result.lastIndexOf("]") + 1;

    if (start === -1 || end === -1) {
      return res.status(400).json({
        message: "AI response does not contain valid JSON"
      });
    }

    const jsonString = result.substring(start, end);

    const rescheduled = JSON.parse(jsonString);

    // update study plan
    rescheduled.forEach(task => {

      const dayIndex = task.day - 1;

      if (studyPlan.plan[dayIndex]) {

        studyPlan.plan[dayIndex].tasks.push({
          subject: task.subject,
          hours: task.hours,
          completed: false
        });

      }

    });

    await studyPlan.save();

    res.json({
      message: "Tasks rescheduled successfully",
      rescheduled
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const adaptiveStudyPlanner = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    const missedTasks = [];

    studyPlan.plan.forEach(day => {
      day.tasks.forEach(task => {
        if (!task.completed) {
          missedTasks.push({
            subject: task.subject,
            hours: task.hours
          });
        }
      });
    });

    if (missedTasks.length === 0) {
      return res.json({
        message: "No missed tasks detected"
      });
    }

    const prompt = `
Redistribute the following study tasks intelligently across the remaining study days.

Tasks:
${JSON.stringify(missedTasks)}

Return JSON format:

[
 {"day":5,"subject":"DBMS","hours":2}
]
`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }]
    });

    const result = completion.choices[0].message.content;

    const start = result.indexOf("[");
    const end = result.lastIndexOf("]") + 1;

    const jsonString = result.substring(start, end);

    const newTasks = JSON.parse(jsonString);

    newTasks.forEach(task => {

      const dayIndex = task.day - 1;

      if (studyPlan.plan[dayIndex]) {
        studyPlan.plan[dayIndex].tasks.push({
          subject: task.subject,
          hours: task.hours,
          completed: false
        });
      }

    });

    await studyPlan.save();

    res.json({
      message: "Adaptive rescheduling complete",
      newTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const studyAssistant = async (req, res) => {
  try {
    const { question, history } = req.body

    const formattedHistory = (history || [])
      .filter((msg) => msg.role === 'user' || msg.role === 'ai')
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }))

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a helpful and friendly study assistant. You help students with study techniques, subject questions, time management, and exam preparation. Keep answers clear, concise and encouraging."
        },
        ...formattedHistory,
        {
          role: "user",
          content: question
        }
      ]
    })

    const answer = completion.choices[0].message.content

    res.json({ answer })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudyAnalytics = async (req, res) => {
  try {

    const { userId } = req.params;

    const studyPlan = await StudyPlan.findOne({ userId });

    if (!studyPlan) {
      return res.status(404).json({
        message: "Study plan not found"
      });
    }

    let totalTasks = 0;
    let completedTasks = 0;
    let totalHours = 0;

    const subjectStats = {};

    studyPlan.plan.forEach(day => {

      day.tasks.forEach(task => {

        totalTasks++;
        totalHours += task.hours;

        if (task.completed) {
          completedTasks++;
        }

        if (!subjectStats[task.subject]) {
          subjectStats[task.subject] = 0;
        }

        subjectStats[task.subject] += task.hours;

      });

    });

    const progress = Math.round((completedTasks / totalTasks) * 100);

    res.json({
      totalTasks,
      completedTasks,
      totalHours,
      progress,
      subjectStats
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteStudyPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    const plan = await StudyPlan.findOneAndDelete({ userId });

    if (!plan) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    res.json({ message: "Study plan deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};