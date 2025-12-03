import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getTrainings } from "../trainingapi";
import type { ActivityStat } from "../types";
import { groupBy, sumBy } from "lodash";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";


function TrainingStats() {
  const [stats, setStats] = useState<ActivityStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTrainings();
        const rawTrainings = data._embedded.trainings;
  
        // Ryhmitys activityn mukaan
        const grouped = groupBy(rawTrainings, (t) => t.activity || "Unknown");
        
        const stats: ActivityStat[] = Object.keys(grouped).map((activity) => ({
          activity,
          totalMinutes: sumBy(grouped[activity], "duration"),
        }));

        setStats(stats);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
      <Paper>
        <Typography>
          Training Statistics
        </Typography>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={stats} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip/>
              <Legend/>
              <Bar dataKey="totalMinutes" name="Duration (min)" fill="#2319ddff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Paper>
  )
};

export default TrainingStats;