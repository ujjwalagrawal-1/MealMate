import Queue from "bull";
const decreaseFilledQueue = new Queue("decrease-filled");

// Job processor
decreaseFilledQueue.process(async (job) => {
  const { messId, hallName } = job.data;
  console.log("Performing after 1 minute");

  try {
    // Find the mess and hall by name
    const mess = await Mess.findById(messId);
    if (!mess) {
      console.error("Mess not found");
      return;
    }

    // Find the specific hall to update
    const hall = mess.halls.find((h) => h.name === hallName);
    if (!hall) {
      console.error("Hall not found");
      return;
    }

    // Decrease the filled count
    if (hall.filled > 0) {
      hall.filled -= 1;
      await mess.save();
      console.log(
        `Decreased filled count for hall ${hallName} in mess ${messId}`
      );
    } else {
      console.log("No filled seats to decrease");
    }
  } catch (err) {
    console.error("Error decreasing filled count:", err.message);
  }
});

// Handle worker events
decreaseFilledQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed.`);
});

decreaseFilledQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed. Error: ${err.message}`);
});

export default decreaseFilledQueue