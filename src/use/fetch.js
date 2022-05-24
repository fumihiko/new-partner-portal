
// 
// arg = {  
//  partnerId: "",
//  timeFrameType: "",
//  timeFrameInDays: "",
//  fromDate: "",
//  toDate: ""
// }
//
// uri options -> getOverallPerformanceSection, getPartnerReach, 
//                getMarketingQualifiedLeads, getLeaderboardSection, 
//                getTotalLeads, getPendingLeads, getLeadsResponded, getOpportunityValue, getAvgResponseTime
// timeFrameType -> 0 if used with timeFrameInDays
//                  1 for custom date
//

export const fetchPPData = (uri, arg) => {
  
  const localtimeNow = new Date().toISOString()  
  
  const request = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter:{
            partnerId: arg.partnerId,
            timeFrameType: arg.timeFrameType,
            timeFrameInDays: arg.timeFrameInDays,
            date: localtimeNow,
            customFromDate:arg.fromDate,
            customToDate: arg.toDate
        }})
      };
      fetch(`/api/reportingservice?uri=reporting/api/partnerDashboard/${uri}`, request)
      .then(async response => {
        const data = await response.json()
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status
          return Promise.reject(error)
        }
        return data.o
      })
      .catch(error => {
        return error;
        // debugging
       // console.error('There was an error!', error)
        //
      })
}

    
export default fetchPPData;

