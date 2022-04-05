const Inspector = require("./papersPlease");

describe("Preliminary training", function () {
  const inspector = new Inspector();
  const bulletin = "Entrants require passport\nAllow citizens of Arstotzka, Obristan";
  inspector.receiveBulletin(bulletin);

  const josef = {
    passport:
      "ID#: GC07D-FU8AR\nNATION: Arstotzka\nNAME: Costanza, Josef\nDOB: 1933.11.28\nSEX: M\nISS: East Grestin\nEXP: 1983.03.15",
  };
  const guyovich = {
    access_permit:
      "NAME: Guyovich, Russian\nNATION: Obristan\nID#: TE8M1-V3N7R\nPURPOSE: TRANSIT\nDURATION: 14 DAYS\nHEIGHT: 159cm\nWEIGHT: 60kg\nEXP: 1983.07.13",
  };
  const roman = {
    passport:
      "ID#: WK9XA-LKM0Q\nNATION: United Federation\nNAME: Dolanski, Roman\nDOB: 1933.01.01\nSEX: M\nISS: Shingleton\nEXP: 1983.05.12",
    grant_of_asylum:
      "NAME: Dolanski, Roman\nNATION: United Federation\nID#: Y3MNC-TPWQ2\nDOB: 1933.01.01\nHEIGHT: 176cm\nWEIGHT: 71kg\nEXP: 1983.09.20",
  };
  const entrant_tests = [
    [josef, "Josef Costanza", "Glory to Arstotzka."],
    [guyovich, "Russian Guyovich", "Entry denied: missing required passport."],
    [roman, "Roman Dolanski", "Detainment: ID number mismatch."],
  ];

  for (let [entrant, name, res] of entrant_tests) {
    it(`Returns "${res}" for "${name}"`, function () {
      const user = inspector.inspect(entrant);
      expect(user === res).toBe(true);
    });
  }
});
