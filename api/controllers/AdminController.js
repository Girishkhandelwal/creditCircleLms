import getPrismaInstance from "../utils/PrismaClient.js";
import { subDays } from 'date-fns';

export async function getAllCampaigns(req, res) {
    try {
        const prisma = getPrismaInstance();

        const campaigns = await prisma.Campaign.findMany();

        res.status(200).json({ campaigns });
    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export async function getAllLoanTypes(req, res) {
    try {
        const prisma = getPrismaInstance();

        const loanTypes = await prisma.LoanType.findMany();

        res.status(200).json({ loanTypes });
    } catch (error) {
        console.error('Error fetching loan type data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeads(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { currentPage, pageSize, LoanType, UtmSource, dateRange, applicationStatus } = req.body;

        const skip = (currentPage - 1) * pageSize;

        // Set up filters based on LoanType, UtmSource, and dateRange
        const filters = {};
        if (LoanType && LoanType !== "All") filters['LoanTypeId'] = LoanType;
        if (UtmSource && UtmSource !== "All") filters['UtmSource'] = UtmSource;

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['LeadCaptureDateTime'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }

        // Add filter for applicationStatus if not 'All'
        if (applicationStatus && applicationStatus !== "All") {
            filters['offers'] = {
                some: {
                    applicationStatus: applicationStatus
                }
            };
        }

        const leads = await prisma.Lead.findMany({
            skip,
            take: parseInt(pageSize),
            where: filters,
            orderBy: {
                LeadCaptureDateTime: 'desc',
            },
            include: {
                offers: {
                    select: {
                        partnerId: true,
                        applicationStatus: true,
                    },
                    where: applicationStatus && applicationStatus !== "All" ? { applicationStatus: applicationStatus } : undefined
                },
                loanType: true,
            },
        });
        const campaigns = await prisma.Campaign.findMany({
            select: {
                id: true,
                CampaignName: true
            }
        });


        // Transform the data before sending the response
        const transformedLeads = leads.map((lead) => {
            const flattenedLead = { ...lead, ...lead.leadToPushRecord };

            if (lead.offers && lead.offers.length > 0) {
                for (let i = 0; i < lead.offers.length; i++) {
                    const partnerName = campaigns.find((c) => c.id == lead.offers[i].partnerId).CampaignName
                    flattenedLead[partnerName] = lead.offers[i].applicationStatus;
                }
            }

            delete flattenedLead.leadToPushRecord; // Remove the nested leadToPushRecord
            delete flattenedLead.offers;

            return flattenedLead;
        });

        // If filters are specified, get count based on the filters; otherwise, get total count
        const totalLeadsCount = Object.keys(filters).length
            ? await prisma.Lead.count({
                where: filters,
            })
            : await prisma.Lead.count();


        res.status(200).json({ leads: transformedLeads, totalLeadsCount });
    } catch (error) {
        console.error('Error fetching lead data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadsDaily(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Define LoanTypes
        const loanTypes = [1, 2, 3, 4, 5, 6];

        // Initialize response object
        const response = {};

        // Get the current date
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day

        // Calculate the end of the day
        const endOfDay = new Date(currentDate.getTime() + 86400000); // Add 24 hours

        // Iterate through each LoanType
        for (const loanType of loanTypes) {
            // Fetch leads for the current LoanType captured today from the database
            const leads = await prisma.Lead.findMany({
                where: {
                    LoanTypeId: loanType,
                    LeadCaptureDateTime: {
                        gte: currentDate.toISOString(), // Use ISOString format
                        lt: endOfDay.toISOString(), // Use ISOString format
                    },
                },
            });

            // Calculate the total daily count for the LoanType
            const totalCount = leads.length;

            // Add total daily count to the response object
            response[loanType] = totalCount;
        }

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching daily leads data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadsWeekly(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Define LoanTypes
        const loanTypes = [1, 2, 3, 4, 5, 6];

        // Initialize response object
        const response = {};

        // Iterate through each LoanType
        for (const loanType of loanTypes) {
            // Fetch leads for the current LoanType from the database
            const leads = await prisma.Lead.findMany({
                where: {
                    LoanTypeId: loanType,
                },
            });

            // Initialize weekly count for the LoanType
            const weeklyCount = {};

            // Update weekly counts based on LeadCaptureDateTime
            leads.forEach((lead) => {
                const isoWeek = lead.LeadCaptureDateTime.toISOString().slice(0, 10);
                weeklyCount[isoWeek] = (weeklyCount[isoWeek] || 0) + 1;
            });

            // Calculate total weekly count for the LoanType
            const totalCount = Object.values(weeklyCount).reduce((acc, count) => acc + count, 0);

            // Add total weekly count to the response object
            response[loanType] = totalCount;
        }

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching weekly leads data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadsMonthly(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Define LoanTypes
        const loanTypes = [1, 2, 3, 4, 5, 6];

        // Initialize response object
        const response = {};

        // Iterate through each LoanType
        for (const loanType of loanTypes) {
            // Initialize monthly counts for the LoanType
            const monthlyCounts = {
                Jan: 0,
                Feb: 0,
                Mar: 0,
                Apr: 0,
                May: 0,
                Jun: 0,
                Jul: 0,
                Aug: 0,
                Sep: 0,
                Oct: 0,
                Nov: 0,
                Dec: 0,
            };

            // Fetch leads for the current LoanType from the database
            const leads = await prisma.Lead.findMany({
                where: {
                    LoanTypeId: loanType,
                },
            });

            // Update monthly counts based on LeadCaptureDateTime
            leads.forEach((lead) => {
                const month = lead.LeadCaptureDateTime.getMonth();
                const monthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(lead.LeadCaptureDateTime);
                monthlyCounts[monthName] += 1;
            });

            // Add monthly counts to the response object
            response[loanType] = monthlyCounts;
        }

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching monthly leads data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadsYearly(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Define LoanTypes
        const loanTypes = [1, 2, 3, 4, 5, 6];

        // Initialize response object
        const response = {};

        // Fetch the current year
        const currentYear = new Date().getFullYear();

        // Initialize yearly counts for all LoanTypes
        const yearlyCounts = {};

        // Iterate through each LoanType
        for (const loanType of loanTypes) {
            // Fetch leads for the current LoanType from the database
            const leads = await prisma.Lead.findMany({
                where: {
                    LoanTypeId: loanType,
                },
            });

            // Update yearly counts based on LeadCaptureDateTime
            leads.forEach((lead) => {
                const year = lead.LeadCaptureDateTime.getFullYear();
                const month = lead.LeadCaptureDateTime.getMonth() + 1; // Month is 0-based
                yearlyCounts[year] = yearlyCounts[year] || {};
                yearlyCounts[year][loanType] = (yearlyCounts[year][loanType] || 0) + 1;
            });
        }

        // Fill in missing months with zeros for each year
        for (let year = currentYear; year >= currentYear - 4; year--) {
            response[year] = response[year] || {};
            loanTypes.forEach((loanType) => {
                response[year][loanType] = yearlyCounts[year]?.[loanType] || 0;
            });
        }

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching yearly leads data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getTotalLeadsByLoanType(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Define LoanTypes
        const loanTypes = [1, 2, 3, 4, 5, 6];

        // Initialize response object
        const response = {};

        // Iterate through each LoanType
        for (const loanType of loanTypes) {
            // Fetch total leads count for the current LoanType from the database
            const totalLeadsCount = await prisma.Lead.count({
                where: {
                    LoanTypeId: loanType,
                },
            });

            // Add total leads count to the response object
            response[loanType] = totalLeadsCount;
        }

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching total leads count:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function exportLeads(req, res) {
    const { LoanType, selectedFields, UtmSource, dateRange, applicationStatus } = req.body;

    try {
        const prisma = getPrismaInstance();

        // Customize your query to fetch leads data based on filters
        const filters = {};
        if (LoanType && LoanType != "All") filters['LoanTypeId'] = LoanType;
        if (UtmSource && UtmSource != "All") filters['UtmSource'] = UtmSource;

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['LeadCaptureDateTime'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }

        const leads = await prisma.Lead.findMany({
            where: filters,
            orderBy: {
                LeadCaptureDateTime: 'desc',
            },
            include: {
                offers: {
                    select: {
                        partnerId: true,
                        applicationStatus: true,
                    },
                    where: applicationStatus && applicationStatus !== "All" ? { applicationStatus: applicationStatus } : undefined
                },
                loanType: true,
            },
        });

        const campaigns = await prisma.Campaign.findMany({
            select: {
                id: true,
                CampaignName: true
            }
        });


        // Transform the data before sending the response
        const transformedLeads2 = leads.map((lead) => {
            const flattenedLead = { ...lead, ...lead.leadToPushRecord };

            if (lead.offers && lead.offers.length > 0) {
                for (let i = 0; i < lead.offers.length; i++) {
                    const partnerName = campaigns.find((c) => c.id == lead.offers[i].partnerId).CampaignName
                    flattenedLead[partnerName] = lead.offers[i].applicationStatus;
                }
            }

            delete flattenedLead.leadToPushRecord; // Remove the nested leadToPushRecord
            delete flattenedLead.offers;

            return flattenedLead;
        });

        // Transform leads data based on selectedFields
        const transformedLeads = transformedLeads2.map((lead) => {
            const transformedLead = {};
            selectedFields.forEach((field) => {
                // Use explicit "null" for empty fields
                transformedLead[field] = lead[field] !== null ? lead[field] : 'null';
            });

            // Convert LeadCaptureDateTime to IST format
            if (lead.LeadCaptureDateTime) {
                const utcDate = new Date(lead.LeadCaptureDateTime);
                const istDate = utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                transformedLead['LeadCaptureDateTime'] = istDate;
            }

            return transformedLead;
        });

        res.status(200).json({ leads: transformedLeads });
    } catch (error) {
        console.error('Error exporting lead data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getUtmSources(req, res) {
    try {
        const prisma = getPrismaInstance();

        // Fetch distinct UtmSource values from the Lead table
        const distinctUtmSources = await prisma.Lead.findMany({
            distinct: ['UtmSource'],
            where: {
                UtmSource: {
                    not: null, // Filter out null values if needed
                },
            },
        });

        // Extract UtmSource values from the result
        const utmSources = distinctUtmSources.map((lead) => lead.UtmSource);

        res.status(200).json({ utmSources });
    } catch (error) {
        console.error('Error fetching distinct UtmSource values:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadColumnNames(req, res) {
    try {
        const prisma = getPrismaInstance();
        // Get the Lead table's column names dynamically using Prisma
        const leadTableColumns = await prisma.$queryRaw`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'tblleads';
        `;

        const campaigns = await prisma.Campaign.findMany({
            select: {
                CampaignName: true
            }
        });




        const additionalColumns = campaigns.map((a) => a.CampaignName)

        // Combine both sets of columns
        const allColumns = [...leadTableColumns.map((column) => column.COLUMN_NAME), ...additionalColumns];

        res.status(200).json({ columns: allColumns });
    } catch (error) {
        console.error('Error fetching lead column names:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function createCampaign(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { formData } = req.body;

        // Extract LoanTypeId from formData
        const { LoanTypeId, ...campaignData } = formData;

        // Fetch LoanType from LoanTypeId
        const loanType = await prisma.loanType.findUnique({
            where: { id: LoanTypeId },
        });

        console.log('loanType', loanType)

        if (!loanType) {
            return res.status(404).json({ error: 'LoanType not found' });
        }

        // Create new campaign with the associated LoanType
        const newCampaign = await prisma.campaign.create({
            data: {
                ...campaignData,
                LoanType: loanType.LoanType,
                loanType: { connect: { id: LoanTypeId } },
            },
        });

        res.status(201).json({ campaign: newCampaign, status: true });

    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function editCampaign(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { formData, id } = req.body;

        // Fetch existing campaign by id
        const existingCampaign = await prisma.campaign.findUnique({
            where: { id: id },
        });

        if (!existingCampaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Extract LoanTypeId from formData
        const { LoanTypeId, ...updatedCampaignData } = formData;

        // Fetch LoanType from LoanTypeId
        const loanType = await prisma.loanType.findUnique({
            where: { id: LoanTypeId },
        });

        if (!loanType) {
            return res.status(404).json({ error: 'LoanType not found' });
        }

        // Update the existing campaign with the new data
        const updatedCampaign = await prisma.campaign.update({
            where: { id: existingCampaign.id },
            data: {
                ...updatedCampaignData,
                LoanType: loanType.LoanType,
                loanType: { connect: { id: LoanTypeId } },
            },
        });

        res.status(200).json({ campaign: updatedCampaign, status: true });

    } catch (error) {
        console.error('Error editing campaign:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getUniqueOffersLeads(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { currentPage, pageSize, dateRange, status } = req.body


        const skip = (currentPage - 1) * pageSize;

        const filters = {};
        if (status && status != "All") filters['applicationStatus'] = status;
        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['applicationDate'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }



        const uniqueLeads = await prisma.offers.findMany({
            skip,
            take: parseInt(pageSize),
            distinct: ['leadId'],
            where: filters,
            orderBy: { leadId: 'asc' },
            include: {
                partnerName: {
                    select: {
                        CampaignName: true
                    }
                },
                personName: true
            }
        });

        // Filter out rows where personName is null
        const filteredLeads = uniqueLeads.filter(lead => lead.personName !== null);

        // If the number of filtered rows is less than the desired pageSize,
        // fetch additional rows until the pageSize is met
        // while (filteredLeads.length < pageSize) {
        //     const additionalLeads = await prisma.offers.findMany({
        //         skip: skip + filteredLeads.length,
        //         take: pageSize - filteredLeads.length,
        //         distinct: ['leadId'],
        //         where: filters,
        //         orderBy: { leadId: 'asc' },
        //         include: {
        //             partnerName: {
        //                 select: {
        //                     CampaignName: true
        //                 }
        //             },
        //             personName: true
        //         }
        //     });

        //     // Filter out rows where personName is null and concatenate them to the filteredLeads array
        //     filteredLeads.push(...additionalLeads.filter(lead => lead.personName !== null));

        //     // Break the loop if there are no more rows to fetch
        //     if (additionalLeads.length === 0) {
        //         break;
        //     }
        // }

        const count = Object.keys(filters).length
            ? await prisma.$queryRaw`
    SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
    FROM tbloffers
    WHERE ${filters}
  `
            : await prisma.$queryRaw`
    SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
    FROM tbloffers
  `;

        const totalCount = count[0].distinctLeadCount || count[0].totalCount;

        res.status(200).json({ uniqueLeads: filteredLeads, count: parseInt(totalCount, 10) });
    } catch (error) {
        console.error('Error fetching distinct leads:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


export async function getStatusWiseOffersList(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { status, selectedLead } = req.body



        const filters = {};
        if (status && status != "All") filters['applicationStatus'] = status;
        if (selectedLead && selectedLead != 0) filters['leadId'] = selectedLead;



        const offersList = await prisma.offers.findMany({
            where: filters,
            include: {
                partnerName: {
                    select: {
                        CampaignName: true,

                    },
                },
                personName: true
            },
        });

        res.status(200).json({ offersList });
    } catch (error) {
        console.error('Error fetching distinct leads:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


export async function getWhatsAppLogs(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { currentPage, pageSize, dateRange } = req.body


        const skip = (currentPage - 1) * pageSize;

        const filters = {};

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['addedDateTime'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }


        const uniqueLeads = await prisma.WhatsAppLogs.findMany({
            skip,
            take: parseInt(pageSize),
            distinct: ['leadId'],
            where: filters,
            orderBy: { leadId: 'asc' },
            include: {
                partnerName: {
                    select: {
                        CampaignName: true
                    }
                },
                personName: true
            }
        });


        // Filter out rows where personName is null
        const filteredLeads = uniqueLeads.filter(lead => lead.personName !== null);

        // If the number of filtered rows is less than the desired pageSize,
        // fetch additional rows until the pageSize is met
        while (filteredLeads.length < pageSize) {
            const additionalLeads = await prisma.WhatsAppLogs.findMany({
                skip: skip + filteredLeads.length,
                take: pageSize - filteredLeads.length,
                distinct: ['leadId'],
                where: filters,
                orderBy: { leadId: 'asc' },
                include: {
                    partnerName: {
                        select: {
                            CampaignName: true
                        }
                    },
                    personName: true
                }
            });

            // Filter out rows where personName is null and concatenate them to the filteredLeads array
            filteredLeads.push(...additionalLeads.filter(lead => lead.personName !== null));

            // Break the loop if there are no more rows to fetch
            if (additionalLeads.length === 0) {
                break;
            }
        }

        const count = Object.keys(filters).length
            ? await prisma.$queryRaw`
            SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
            FROM tblwhatsapplog
            WHERE ${filters}
          `
            : await prisma.$queryRaw`
            SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
            FROM tblwhatsapplog
          `;

        const totalCount = count[0].distinctLeadCount || count[0].totalCount;


        res.status(200).json({ logs: filteredLeads, count: parseInt(totalCount, 10) });
    } catch (error) {
        console.error('Error fetching whatsAppLogs:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


export async function getLeadWiseWhatsAppLogs(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { selectedLead } = req.body


        const filters = {};

        if (selectedLead && selectedLead != 0) filters['leadId'] = selectedLead;

        const twoDaysAgo = subDays(new Date(), 2);

        filters['addedDateTime'] = {
            gte: twoDaysAgo.toISOString(), // Greater than or equal to two days ago
        };

        const logsData = await prisma.WhatsAppLogs.findMany({
            where: filters,
            include: {
                partnerName: {
                    select: {
                        CampaignName: true,

                    },
                },
                personName: true
            },
        });

        res.status(200).json({ logsData });
    } catch (error) {
        console.error('Error fetching distinct leads:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getLeadPushLogs(req, res) {

    try {

        const prisma = getPrismaInstance();
        const { dateRange } = req.body


        const filters = {};

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['applicationDate'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }

        const uniqueLeads = await prisma.offers.findMany({
            where: filters,
            distinct: ['partnerId'],
            include: {
                partnerName: {
                    select: {
                        CampaignName: true
                    }
                },
            }
        });


        for (const lead of uniqueLeads) {
            const partnerId = lead.partnerId;

            // Fetch counts for each applicationStatus for the current partnerId
            const counts = await prisma.offers.groupBy({
                by: ['applicationStatus'],
                where: {
                    partnerId: partnerId,
                    applicationStatus: {
                        in: ['success', 'failure', 'pending', 'reject']
                    },
                    applicationDate: filters['applicationDate'] // Applying date range filter
                },
                _count: true
            });

            // Initialize counts for each applicationStatus
            lead.successCount = 0;
            lead.failureCount = 0;
            lead.pendingCount = 0;
            lead.rejectCount = 0;

            // Update counts based on fetched counts
            for (const count of counts) {
                switch (count.applicationStatus) {
                    case 'success':
                        lead.successCount = count._count;
                        break;
                    case 'failure':
                        lead.failureCount = count._count;
                        break;
                    case 'pending':
                        lead.pendingCount = count._count;
                        break;
                    case 'reject':
                        lead.rejectCount = count._count;
                        break;
                    default:
                        break;
                }
            }
        }

        // Send the response with uniqueLeads including counts for each applicationStatus
        res.status(200).json({ logs: uniqueLeads });

    } catch (error) {
        console.error('Error fetching whatsAppLogs:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


export async function getLeadWiseLeadPushLogs(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { selectedLead } = req.body

        console.log(selectedLead)

        const filters = {};

        if (selectedLead && selectedLead != 0) filters['leadId'] = selectedLead;

        const twoDaysAgo = subDays(new Date(), 2);

        filters['addedDateTime'] = {
            gte: twoDaysAgo.toISOString(), // Greater than or equal to two days ago
        };


        const logsData = await prisma.LeadPushLogs.findMany({
            where: filters,
            include: {
                partnerName: {
                    select: {
                        CampaignName: true,

                    },
                },
                personName: true
            },
        });



        res.status(200).json({ logsData });
    } catch (error) {
        console.error('Error fetching selected lead:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getEmailLogs(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { currentPage, pageSize, dateRange } = req.body


        const skip = (currentPage - 1) * pageSize;

        const filters = {};

        if (dateRange && dateRange.startDate && dateRange.endDate) {
            // Convert endDate to include time component (end of day)
            const endDateWithTime = new Date(`${dateRange.endDate}T23:59:59`);
            filters['addedDateTime'] = {
                gte: new Date(dateRange.startDate),
                lte: endDateWithTime,
            };
        }


        const uniqueLeads = await prisma.EmailLogs.findMany({
            skip,
            take: parseInt(pageSize),
            distinct: ['leadId'],
            where: filters,
            orderBy: { leadId: 'asc' },
            include: {
                partnerName: {
                    select: {
                        CampaignName: true
                    }
                },
                personName: true
            }
        });

        // Filter out rows where personName is null
        const filteredLeads = uniqueLeads.filter(lead => lead.personName !== null);

        // If the number of filtered rows is less than the desired pageSize,
        // // fetch additional rows until the pageSize is met
        while (filteredLeads.length < pageSize) {
            const additionalLeads = await prisma.EmailLogs.findMany({
                skip: skip + filteredLeads.length,
                take: pageSize - filteredLeads.length,
                distinct: ['leadId'],
                where: filters,
                orderBy: { leadId: 'asc' },
                include: {
                    partnerName: {
                        select: {
                            CampaignName: true
                        }
                    },
                    personName: true
                }
            });

            // Filter out rows where personName is null and concatenate them to the filteredLeads array
            filteredLeads.push(...additionalLeads.filter(lead => lead.personName !== null));

            // Break the loop if there are no more rows to fetch
            if (additionalLeads.length === 0) {
                break;
            }
        }


        const count = Object.keys(filters).length
            ? await prisma.$queryRaw`
        SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
        FROM tblemailLogs
        WHERE ${filters}
      `
            : await prisma.$queryRaw`
        SELECT COUNT(DISTINCT leadId) AS distinctLeadCount
        FROM tblemailLogs
      `;

        const totalCount = count[0].distinctLeadCount || count[0].totalCount;

        res.status(200).json({ logs: filteredLeads, count: parseInt(totalCount, 10) });
    } catch (error) {
        console.error('Error fetching EmailLogs:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}


export async function getLeadWiseEmailogs(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { selectedLead } = req.body


        const filters = {};

        if (selectedLead && selectedLead != 0) filters['leadId'] = selectedLead;

        const twoDaysAgo = subDays(new Date(), 2);

        filters['addedDateTime'] = {
            gte: twoDaysAgo.toISOString(), // Greater than or equal to two days ago
        };

        const logsData = await prisma.EmailLogs.findMany({
            where: filters,
            include: {
                partnerName: {
                    select: {
                        CampaignName: true,

                    },
                },
                personName: true
            },
        });

        res.status(200).json({ logsData });
    } catch (error) {
        console.error('Error fetching selected lead:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function getOfferList(req, res) {

    try {
        const prisma = getPrismaInstance();

        const offers = await prisma.OfferList.findMany();

        res.status(200).json({ offers });
    } catch (error) {
        console.error('Error fetching offer data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export async function createOffer(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { formData } = req.body;

        const newOffer = await prisma.OfferList.create({
            data: {
                loanTypeId: formData.loanTypeId,
                offerTitle: formData.offerTitle,
                offerDescription: formData.offerDescription,
                isActive: formData.isActive,
                offerImage: formData.offerImage,
                redirectUrl:formData.redirectUrl
            },
        });

        res.status(201).json({ offer: newOffer, status: true });

    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

export async function editOffer(req, res) {
    try {
        const prisma = getPrismaInstance();
        const { formData, id } = req.body;

        // Fetch existing campaign by id
        const existingOffer = await prisma.OfferList.findUnique({
            where: { id: id },
        });

        if (!existingOffer) {
            return res.status(404).json({ error: 'offer not found' });
        }

       

        // Update the existing campaign with the new data
        const updatedOffer= await prisma.OfferList.update({
            where: { id: existingOffer.id },
            data: {
                loanTypeId: formData.loanTypeId,
                offerTitle: formData.offerTitle,
                offerDescription: formData.offerDescription,
                isActive: formData.isActive,
                offerImage: formData.offerImage
            },
        });

        res.status(200).json({ offer: updatedOffer, status: true });

    } catch (error) {
        console.error('Error editing campaign:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}











