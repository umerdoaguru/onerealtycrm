import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled from "styled-components";

const LeadVisitChart = () => {
  const [loading, setLoading] = useState(false);
  const [visitData, setVisitData] = useState([]); // Store structured data

  useEffect(() => {
    const getLeadList = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://crm.one-realty.in/api/leads`);
        const leadList = response.data;
        console.log(leadList)
        // Filter out "pending" visits
        const filteredLeads = leadList.filter((item) => item.visit !== "pending");

        // Group data by visit_date and count total visits
        let result = {};

        filteredLeads.forEach((lead) => {
          const visitDate = lead.visit_date;
          if (visitDate) {
            if (!result[visitDate]) {
              result[visitDate] = { date: visitDate, totalVisits: 0 };
            }
            // Increment total visit count for the date
            result[visitDate].totalVisits += 1;
          }
        });

        // Convert result object to array
        const structuredData = Object.values(result);
        setVisitData(structuredData); // Set the structured data in state
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    getLeadList();
  }, []);

  return (
    <Wrapper>
      <div className="w-full max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-2">Daily Visit Overview</h2>
        <p className="text-sm text-gray-500 mb-4">Total visits per day (excluding pending)</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={400}
              height={300}
              data={visitData}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 12,
                  transform: "translate(-10,0)",
                  dy: 5,
                  fill: "#666",
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalVisits"
                fill="#8884d8"
                name="Total Visits"
                barSize={15}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Wrapper>
  );
};

export default LeadVisitChart;

const Wrapper = styled.div`
  #main {
    width: 100%;
    border-radius: 5px;
    padding: 2rem;
    box-shadow: 0px 2px 18px #bdbaba;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    padding: 20px;
    font-size: small;
  }
`;
