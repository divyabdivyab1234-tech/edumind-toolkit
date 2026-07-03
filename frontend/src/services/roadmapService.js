import axios from "axios";

export const generateRoadmap = async (goal) => {
  const res = await axios.post("http://localhost:5000/api/roadmap", {
    goal,
  });
  return res.data;
};
