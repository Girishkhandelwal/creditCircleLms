import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import {
    CogIcon,
    UserIcon,
    BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

export default function Track({ logsData }) {

    

    function convertToIST(dateTimeString) {
        // Convert string to Date object
        const date = new Date(dateTimeString);
      
        // Options for formatting
        const options = {
          timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
      
        // Convert to Indian Standard Time (IST)
        const ISTDateTime = date.toLocaleString('en-IN', options);
      
        return ISTDateTime;
      }

      console.log(logsData[0])

      const fullName = logsData.length > 0 && logsData[0].personName ? 
      (logsData[0].personName.FullName ? logsData[0].personName.FullName : `${logsData[0].personName.FirstName} ${logsData[0].personName.LastName}`) : 
      '';
    

    return (

        <ol class="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 p-5 left-[30%] ">

          {logsData.length > 0 &&  <div className="p-2 mb-5">
                <p className="text-lg font-bold text-green-600">{fullName} Logs : -</p>
            </div>
}
            {logsData.map((log, index) => (

                <li key={index} class=" mb-10 ms-6 text-black">

                    <div class="absolute flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                        <svg class="w-3.5 h-3.5 text-gray-700 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                        </svg>
                    </div>
                    <h3 class="font-medium leading-tight ">{log.partnerName.CampaignName}</h3>
                    <p class="text-sm">{convertToIST(log.addedDateTime)}</p>
                </li>

            ))
            }
        </ol>

    );
}
