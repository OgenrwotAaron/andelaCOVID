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

// Returns the infectionsByRequestTime value
const infections = (currentlyInfected, timeToElapse, periodType) => {
  let infectionsByRequestTime = null;
  let days;
  switch (periodType) {
    case 'days':
      infectionsByRequestTime = currentlyInfected * (2 ** Math.trunc(timeToElapse / 3));
      break;
    case 'weeks':
      days = timeToElapse * 7;
      infectionsByRequestTime = currentlyInfected * (2 ** Math.trunc(days / 3));
      break;
    case 'months':
      days = timeToElapse * 30;
      infectionsByRequestTime = currentlyInfected * (2 ** Math.trunc(days / 3));
      break;
    default:
      infectionsByRequestTime = currentlyInfected * (2 ** Math.trunc(timeToElapse / 3));
      break;
  }

  return infectionsByRequestTime;
};

const covid19ImpactEstimator = (data) => {
  const { reportedCases, timeToElapse, periodType } = data;

  const impact = {
    currentlyInfected: reportedCases * 10,
    get infectionsByRequestTime() {
      return infections(this.currentlyInfected, timeToElapse, periodType);
    }
  };
  const severeImpact = {
    currentlyInfected: reportedCases * 50,
    get infectionsByRequestTime() {
      return infections(this.currentlyInfected, timeToElapse, periodType);
    }
  };

  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
