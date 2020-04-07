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
      infectionsByRequestedTime = currentlyInfected * (2 ** (Math.trunc(timeToElapse / 3)));
      break;
    case 'weeks':
      days = timeToElapse * 7;
      infectionsByRequestedTime = currentlyInfected * (2 ** (Math.trunc(days / 3)));
      break;
    case 'months':
      days = timeToElapse * 30;
      infectionsByRequestedTime = currentlyInfected * (2 ** (Math.trunc(days / 3)));
      break;
    default:
      infectionsByRequestedTime = currentlyInfected * (2 ** (Math.trunc(timeToElapse / 3)));
      break;
  }

  return infectionsByRequestedTime;
};

const bedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const available = Math.trunc(totalHospitalBeds * 0.35);
  return available - severeCasesByRequestedTime;
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds
  } = data;
  const periodT = periodType;
  const timeToE = Big(timeToElapse);
  const reported = Big(reportedCases);
  const hospitalBeds = Big(totalHospitalBeds);

  const impact = {
    currentlyInfected: reported * 10,
    get infectionsByRequestedTime() {
      return infections(this.currentlyInfected, timeToE, periodT);
    },
    get severeCasesByRequestedTime() {
      return Math.trunc(this.infectionsByRequestedTime * 0.15);
    },
    get hospitalBedsByRequestedTime() {
      return bedsByRequestedTime(hospitalBeds, this.severeCasesByRequestedTime);
    }
  };

  const severeImpact = {
    currentlyInfected: reported * 50,
    get infectionsByRequestedTime() {
      return infections(this.currentlyInfected, timeToE, periodT);
    },
    get severeCasesByRequestedTime() {
      return Math.trunc(this.infectionsByRequestedTime * 0.15);
    },
    get hospitalBedsByRequestedTime() {
      return bedsByRequestedTime(hospitalBeds, this.severeCasesByRequestedTime);
    }
  };

  return {
    data,
    impact,
    severeImpact
  };
};
export default covid19ImpactEstimator;
