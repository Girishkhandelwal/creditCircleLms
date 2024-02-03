import React, { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import Chart from "chart.js/auto";
import axios from "axios";
import {
  GET_LEADS_DAILY_ROUTE,
  GET_LEADS_WEEKLY_ROUTE,
  GET_LEADS_MONTHLY_ROUTE,
  GET_LEADS_YEARLY_ROUTE,
} from "../../utils/ApiRoutes";

export default function LoanTypeChart() {
  const chartRef = useRef(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Month");
  const [loader, setLoader] = useState(false);

  const fetchChartData = async (timeFrame) => {
    setLoader(true);

    try {
      let response;
      switch (timeFrame) {
        case "Year":
          response = await axios.get(GET_LEADS_YEARLY_ROUTE);
          break;
        case "Month":
          response = await axios.get(GET_LEADS_MONTHLY_ROUTE);
          break;
        case "Week":
          response = await axios.get(GET_LEADS_WEEKLY_ROUTE);
          break;
        case "Day":
          response = await axios.get(GET_LEADS_DAILY_ROUTE);
          break;
        default:
          response = await axios.get(GET_LEADS_MONTHLY_ROUTE);
      }

      if (!response.data) {
        throw new Error(`Error fetching data`);
      }

      setLoader(false);

      const data = response.data;
      let labels, personalLoanData, businessLoanData, incomePlanData, termInsuranceData, goldData, creditCardData;

      switch (timeFrame) {
        case "Year":
          labels = Object.keys(data);
          personalLoanData = labels.map((year) => data[year][1]);
          businessLoanData = labels.map((year) => data[year][2]);
          incomePlanData = labels.map((year) => data[year][3]);
          termInsuranceData = labels.map((year) => data[year][4]);
          goldData = labels.map((year) => data[year][5]);
          creditCardData = labels.map((year) => data[year][6]);
          break;
        case "Month":
          labels = Object.keys(data[1]);
          personalLoanData = labels.map((month) => data[1][month]);
          businessLoanData = labels.map((month) => data[2][month]);
          incomePlanData = labels.map((month) => data[3][month]);
          termInsuranceData = labels.map((month) => data[4][month]);
          goldData = labels.map((month) => data[5][month]);
          creditCardData = labels.map((month) => data[6][month]);
          break;
        case "Week":
          labels = ["This Week"];
          personalLoanData = [data[1]];
          businessLoanData = [data[2]];
          incomePlanData = [data[3]];
          termInsuranceData = [data[4]];
          goldData = [data[5]];
          creditCardData = [data[6]];
          break;
        case "Day":
          labels = ["Today"];
          personalLoanData = [data[1]];
          businessLoanData = [data[2]];
          incomePlanData = [data[3]];
          termInsuranceData = [data[4]];
          goldData = [data[5]];
          creditCardData = [data[6]];
          break;
        default:
          labels = [];
          personalLoanData = [];
          businessLoanData = [];
          incomePlanData = [];
          termInsuranceData = [];
          goldData = [];
          creditCardData = [];
      }

      // Create the chart configuration
      const config = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Personal Loan",
              data: personalLoanData,
              borderColor: "rgb(109, 253, 181)",
              backgroundColor: "rgba(109, 253, 181, 0.5)",
              borderWidth: 2,
            },
            {
              label: "Business Loan",
              data: businessLoanData,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderWidth: 2,
            },
            {
              label: "Income Plan",
              data: incomePlanData,
              borderColor: "rgb(255, 205, 186)",
              backgroundColor: "rgba(255, 205, 186, 0.5)",
              borderWidth: 2,
            },
            {
              label: "Term Insurance",
              data: termInsuranceData,
              borderColor: "rgb(109, 253, 12)",
              backgroundColor: "rgba(109, 253, 12, 0.5)",
              borderWidth: 2,
            },
            {
              label: "Gold",
              data: goldData,
              borderColor: "rgb(255, 205, 86)",
              backgroundColor: "rgba(255, 205, 86, 0.5)",
              borderWidth: 2,
            },
            {
              label: "Credit Card",
              data: creditCardData,
              borderColor: "rgb(453, 25, 186)",
              backgroundColor: "rgba(453, 25, 186, 0.5)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 10,
            },
          },
        },
      };

      // Get the canvas element
      const ctx = document.getElementById("myChart").getContext("2d");

      // Check if there's an existing chart and destroy it
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create the new chart
      chartRef.current = new Chart(ctx, config);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data based on the selected time frame (default: "Month")
    fetchChartData(selectedTimeFrame);
  }, [selectedTimeFrame]);

  return (
    <div className="px-10 mb-10">
      <div className="lg:flex gap-5 my-5">
        <Button
          color="blue"
          variant="outlined"
          onClick={() => setSelectedTimeFrame("Year")}
        >
          Year
        </Button>
        <Button
          color="blue"
          variant="outlined"
          onClick={() => setSelectedTimeFrame("Month")}
        >
          Month
        </Button>
        <Button
          color="blue"
          variant="outlined"
          onClick={() => setSelectedTimeFrame("Week")}
        >
          Week
        </Button>
        <Button
          color="blue"
          variant="outlined"
          onClick={() => setSelectedTimeFrame("Day")}
        >
          Day
        </Button>
      </div>

      <div className="h-[50%] relative">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          {loader && (
            <Spinner />
          )}

        </div>
        <div className="flex mx-auto my-auto">
          <div className="w-full border border-gray-400 pt-0 rounded-xl h-fit my-auto shadow-xl z-10">
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
