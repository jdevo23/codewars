/*
  Papers, Please
  https://www.codewars.com/kata/59d582cafbdd0b7ef90000a0
*/

class Inspector {
  constructor() {
    this.ALL_NATIONS = [
      "Arstotzka",
      "Antegria",
      "Impor",
      "Kolechia",
      "Obristan",
      "Republia",
      "United Federation",
    ];
    this.nations = this.ALL_NATIONS.reduce(
      (o, key) => ({
        ...o,
        [key]: {
          isAllowed: false,
          documentsRequired: [],
          vaccinationsRequired: [],
        },
      }),
      {}
    );
    this.otherEntities = {
      workers: {
        documentsRequired: [],
      },
    };
    this.wantedPerson = "";
  }

  normaliseName(name) {
    const [lastName, firstName] = name.split(", ");
    return firstName + " " + lastName;
  }

  validateDocumentExpirationDate(date) {
    return new Date("1982.11.22").valueOf() < new Date(date).valueOf();
  }

  updateStateProperties(propertyToUpdate, document, isRequired) {
    const index = propertyToUpdate.findIndex(idx => idx === document);
    isRequired
      ? index < 0
        ? propertyToUpdate.push(document)
        : null
      : propertyToUpdate.splice(index, 1);
  }

  receiveBulletin(bulletin) {
    if (!bulletin.length) {
      return;
    }

    this.bulletin = bulletin;

    // parse bulletin
    const items = [...this.bulletin.split("\n")];

    items.forEach(i => {
      // Allow or deny citizens
      if (i.includes("citizens")) {
        const listOfNations = i.match(/(?<=of |, )\w+\s?\w+/g);
        const isAllowed = /Allow/g.test(i);
        listOfNations.forEach(n => {
          this.nations[n].isAllowed = isAllowed;
        });
      }

      // Required documents
      if (
        /(?<=require )passport|ID card|work pass|access permit|grant of asylum|diplomatic authorization/g.test(
          i
        )
      ) {
        const entrantType = /^[^\s]+/g.exec(i)[0];
        const obj = {
          entrantType,
          document: /(?<=require )\w+\s?\w+/g.exec(i)[0].replace(/\s/gi, "_"),
          isRequired: /(?<!no longer )require/g.test(i),
          nations:
            entrantType === "Citizens"
              ? i.match(/(?<=of |, )(\w+)/g)
              : entrantType === "Foreigners"
              ? this.ALL_NATIONS.filter(n => n !== "Arstotzka")
              : [...this.ALL_NATIONS],
        };

        if (obj.entrantType === "Workers") {
          this.updateStateProperties(
            this.otherEntities.workers.documentsRequired,
            obj.document,
            obj.isRequired
          );
        } else {
          obj.nations.forEach(key => {
            this.updateStateProperties(
              this.nations[key].documentsRequired,
              obj.document,
              obj.isRequired
            );
          });
        }
      }

      // Required vaccinations
      if (i.includes("vaccination")) {
        const entrantType = /^[^\s]+/g.exec(i)[0];
        const obj = {
          entrantType,
          vaccination: /(?<=require )(\w+(\s\w+)?)(?= vaccination)/g.exec(i)[0],
          isRequired: /(?<!no longer )require/g.test(i),
          nations:
            entrantType === "Citizens"
              ? i
                  .split(i.includes("no longer") ? "no longer" : "require")[0]
                  .match(/(?<=of |, )\w+(\s\w+)?/g)
              : entrantType === "Foreigners"
              ? this.ALL_NATIONS.filter(n => n !== "Arstotzka")
              : [...this.ALL_NATIONS],
        };

        obj.nations.forEach(key => {
          this.updateStateProperties(
            this.nations[key].vaccinationsRequired,
            obj.vaccination,
            obj.isRequired
          );
        });
      }

      // Wanted criminal
      if (/(?<=Wanted by the State: )\w+ \w+/g.exec(i)) {
        this.wantedPerson = /(?<=Wanted by the State: )\w+ \w+/g.exec(i)[0];
      } else {
        this.wantedPerson = "";
      }
    });
  }

  inspect(entrant) {
    this.entrant = entrant;

    const entrantCopy = Object.assign({}, this.entrant);
    const keys = Object.keys(entrantCopy);

    // handle empty entrant object
    if (!keys.length) {
      return "Entry denied: missing required passport.";
    }

    const inspectionResults = [];
    const inspectionObject = {
      reasonForFailure: "",
      severity: 1, // 1: Entry denied, 2. Detainment, 3. Detainment as a criminal
    };

    const addInspectionFailure = ({ severity = 1, reasonForFailure }) => {
      const inspectionFailure = Object.assign({}, inspectionObject);
      inspectionFailure.severity = severity;
      inspectionFailure.reasonForFailure = reasonForFailure;
      inspectionResults.push(inspectionFailure);
    };

    // normalise the data for ease of use
    keys.forEach(k => {
      const spl = entrantCopy[k].split("\n");
      const cpy = {};
      spl.forEach(sp => {
        let [key, value] = sp.split(": ");
        if (key === "ID#") {
          key = "ID";
        }
        if (key === "NAME") {
          value = this.normaliseName(value);
        }
        cpy[key] = value;
      });
      entrantCopy[k] = cpy;
    });

    let nation = null;

    keys.forEach(key => {
      if (entrantCopy[key].NATION) {
        nation = entrantCopy[key].NATION;
        return;
      }
    });

    if (!nation) {
      return "Entry denied: missing required passport.";
    }

    // CHECK ENTRANT'S NATION IS ALLOWED ENTRY
    if (!this.nations[nation].isAllowed) {
      addInspectionFailure({ reasonForFailure: "citizen of banned nation." });
    }

    // CHECK ENTRANT HAS ALL DOCUMENTS REQUIRED FROM THEIR NATION
    if (nation === "Arstotzka") {
      this.nations.Arstotzka.documentsRequired.forEach(doc => {
        if (!keys.includes(doc)) {
          addInspectionFailure({
            reasonForFailure: `missing required ${doc.replace("_", " ")}.`,
          });
        }
      });
    } else {
      this.nations[nation].documentsRequired.forEach(doc => {
        if (doc === "passport" && !keys.includes("passport")) {
          addInspectionFailure({
            reasonForFailure: "missing required passport.",
          });
        }

        if (doc === "access_permit") {
          if (!entrantCopy.access_permit && !entrantCopy.grant_of_asylum) {
            if (
              entrantCopy.diplomatic_authorization &&
              !entrantCopy.diplomatic_authorization.ACCESS.includes("Arstotzka")
            ) {
              addInspectionFailure({
                reasonForFailure: "invalid diplomatic authorization.",
              });
            } else if (!entrantCopy.diplomatic_authorization) {
              addInspectionFailure({
                reasonForFailure: "missing required access permit.",
              });
            }
          }
        }
      });
    }

    // CHECK EXISTING DOCUMENTS
    keys.forEach(k => {
      // check if entrant is wanted criminal
      if (entrantCopy[k].NAME === this.wantedPerson) {
        addInspectionFailure({
          severity: 3,
          reasonForFailure: "Entrant is a wanted criminal.",
        });
        return;
      }

      // check for document expirations
      // not all documents have expiry dates, hence first boolean assertion
      if (
        ["access_permit", "grant_of_asylum", "id_card", "passport", "work_pass"].includes(k) &&
        !this.validateDocumentExpirationDate(entrantCopy[k].EXP)
      ) {
        addInspectionFailure({
          reasonForFailure: `${k.replace(/_/gi, " ")} expired.`,
        });
      }
    });

    // check for document mismatches
    ["DOB", "HEIGHT", "ID", "NAME", "NATION", "SEX", "WEIGHT"].forEach(key => {
      let first = "";
      keys.forEach(k => {
        if (entrantCopy[k][key]) {
          if (!first.length) {
            first = entrantCopy[k][key];
          } else if (entrantCopy[k][key] !== first) {
            let keyName = key;

            switch (keyName) {
              case "ID":
                keyName = "ID number";
                break;
              case "NATION":
                keyName = "nationality";
                break;
              default:
                null;
            }

            addInspectionFailure({
              severity: 2,
              reasonForFailure: `${keyName} mismatch.`,
            });
          }
        }
      });
    });

    // CHECK OTHER DOCUMENTS E.G. DOCUMENTS REQUIRED OF WORKERS
    if (
      this.otherEntities.workers.documentsRequired.includes("work_pass") &&
      entrantCopy.access_permit &&
      entrantCopy.access_permit.PURPOSE === "WORK"
    ) {
      if (!entrantCopy.work_pass) {
        addInspectionFailure({
          reasonForFailure: "missing required work pass.",
        });
      }
    }

    // CHECK FOR VACCINATIONS
    if (this.nations[nation].vaccinationsRequired.length) {
      let message = "";

      if (!entrantCopy.certificate_of_vaccination) {
        message = "missing required certificate of vaccination.";
      }

      if (
        entrantCopy.certificate_of_vaccination &&
        !this.nations[nation].vaccinationsRequired.every(v =>
          entrantCopy.certificate_of_vaccination.VACCINES.includes(v)
        )
      ) {
        message = "missing required vaccination.";
      }

      if (message.length) {
        addInspectionFailure({
          reasonForFailure: message,
        });
      }
    }

    if (!inspectionResults.length) {
      return entrantCopy[keys[0]].NATION === "Arstotzka"
        ? "Glory to Arstotzka."
        : "Cause no trouble.";
    }

    const sortedInspectionResults = inspectionResults.sort((a, b) => b.severity - a.severity);
    return (
      (sortedInspectionResults[0].severity >= 2 ? "Detainment" : "Entry denied") +
      ": " +
      sortedInspectionResults[0].reasonForFailure
    );
  }
}

module.exports = Inspector;
