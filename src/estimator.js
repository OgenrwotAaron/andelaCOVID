const Big = require('big-js');
// Input data structured as
/* {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
} */

// Output data structured as
/*
{
    data: {}, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
}
*/

// Returns the infectionsByRequestedTime value
const infections = (currentlyInfected, timeToElapse, periodType) => {
  let infectionsByRequestedTime = null;
  let days;
  switch (periodType) {
    case 'days':
      infectionsByRequestedTime = currentlyInfected * (2 ** Math.trunc(timeToElapse / 3));
      break;
    case 'weeks':
      days = timeToElapse * 7;
      infectionsByRequestedTime = currentlyInfected * (2 ** Math.trunc(days / 3));
      break;
    case 'months':
      days = timeToElapse * 30;
      infectionsByRequestedTime = currentlyInfected * (2 ** Math.trunc(days / 3));
      break;
    default:
      infectionsByRequestedTime = currentlyInfected * (2 ** Math.trunc(timeToElapse / 3));
      break;
  }

  return infectionsByRequestedTime;
};

const covid19ImpactEstimator = (data) => {
  const { reportedCases, timeToElapse, periodType } = data;
  const periodT = periodType;
  const timeToE = Big(timeToElapse);
  const reported = Big(reportedCases);

  const impact = {};
  impact.currentlyInfected = reported * Big(10);
  impact.infectionsByRequestedTime = infections(impact.currentlyInfected, timeToE, periodT);

  const severeImpact = {};
  severeImpact.currentlyInfected = reported * Big(50);
  severeImpact.infectionsByRequestedTime = infections(impact.currentlyInfected, timeToE, periodT);

  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
