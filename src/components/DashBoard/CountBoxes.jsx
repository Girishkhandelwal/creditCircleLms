import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CountUp from "react-countup";
import { GET_LEADS_COUNT_BY_LOANTYPE } from "../../../src/utils/ApiRoutes";

export default function DashboardBoxes() {
  const [leadsCount, setLeadsCount] = useState({});

  useEffect(() => {
    // Fetch leads count from the API
    fetchLeadsCount();
  }, []);

  const fetchLeadsCount = async () => {
    try {
      const response = await fetch(GET_LEADS_COUNT_BY_LOANTYPE);
      const data = await response.json();
      setLeadsCount(data);
    } catch (error) {
      console.error("Error fetching leads count:", error);
    }
  };

  return (
    <>
      <div className="bg-[#b5c9e8] p-4 rounded-lg">
      <div className="flex gap-2 justify-between">
        {Object.keys(leadsCount).map((loanType) => (
          <Link
            key={loanType}
            href="/"
            className={`w-[15%] bg-gray-100  rounded-lg flex justify-center items-center flex-col hover:shadow-lg hover:transition-all`}
          >
            {loanType === "1" && (
              <Image
                src={"/dashboard/click.png"}
                height={50}
                width={50}
                alt="click Icon"
                className="mt-2"
              />
            )}
            {loanType === "2" && (
              <Image
                src={"/dashboard/event.png"}
                height={50}
                width={50}
                alt="click Icon"
                className="mt-2"
              />
            )}
            {loanType === "3" && (
              <Image
                src={"/dashboard/icon-admin.svg"}
                height={50}
                width={50}
                alt="Admin Icon"
              />
            )}
            {loanType === "4" && (
              <Image
                src={"/dashboard/icon-advertiser.svg"}
                height={50}
                width={50}
                alt="Advertiser Icon"
              />
            )}
            {loanType === "5" && (
              <Image
                src={"/dashboard/icon-publisher.svg"}
                height={50}
                width={50}
                alt="Publishers Icon"
              />
            )}
            {loanType === "6" && (
              <Image
                src={"/dashboard/icon-campaigns.svg"}
                height={50}
                width={50}
                alt="Campaigns Icon"
              />
            )}

            <p className="text-primary-color font-primary-font mt-2">
              {loanType === "1" && "Personal Loan"}
              {loanType === "2" && "Business Loan"}
              {loanType === "3" && "Income Plan"}
              {loanType === "4" && "Term Insurance"}
              {loanType === "5" && "Gold"}
              {loanType === "6" && "Credit Card"}
            </p>
            <p className="text-black-color font-primary-font font-extrabold text-lg mb-3">
              <CountUp end={leadsCount[loanType] || 0} duration={4} />
            </p>
          </Link>
        ))}
      </div>
      </div>
    </>
  );
}
