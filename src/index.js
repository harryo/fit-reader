import FitReader from './FitReader';

function fitReader(buffer, onProgress) {
  const reader = new FitReader(buffer);
  reader.parse(onProgress);
  return reader.globalData;
  // const allPoints = [];
  // const result = {
  //   data: reader.globalData.map((msg) => {
  //     const points = readGeoMessage(msg);
  //     if (points.length === 0) {
  //       return msg;
  //     }
  //     allPoints.push(points);
  //     return {
  //       ...msg,
  //       points,
  //     };
  //   }),
  // };
  // result.points = allPoints.flat().sort((a, b) => (Math.sign(a - b)));
  // return result;
}

export default fitReader;
