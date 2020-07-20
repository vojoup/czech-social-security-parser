const rodneCisloRegExp = new RegExp(
  /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/
);

class CzechSocialSecurityNumber {
  match;
  isValid = false;
  day;
  month;
  year;
  sex;
  
  constructor(rodneCislo) {
    const match = rodneCislo.match(rodneCisloRegExp);
    this.match = match;
    
    if (match) {
      this.sex = "male";
      this.parseSSN();
    }
  }
  
  get isValid() {
    return !!this.match;
  }

  get sex() {
    return this.sex;
  }

  parseSSN() {
    let [, year, month, day, extra, control] = this.match;
    if (control === "") {
      year = +year < 54 ? +year + 1900 : +year + 1800;
    } else {
      // kontrolní číslice
      let mod = Number(`${year}${month}${day}${extra}`) % 11;
      if (mod === 10) mod = 0;
      if (mod !== +control) {
        return false;
      }

      year = +year < 54 ? +year + 2000 : +year + 1900;
      console.log("Rok", year);
    }

    // k měsíci může být připočteno 20, 50 nebo 70
    if (+month > 70 && +year > 2003) {
      month = +month - 70;
    } else if (+month > 50) {
      this.sex = "female";
      month = +month - 50;
    } else if (+month > 20 && +year > 2003) {
      month = +month + 20;
    }

    this.year = year;
    this.month = month;
    this.day = day;
  }

  get dateOfBirth() {
    const date = new Date(this.year, this.month, this.day);
    if (date) return date.toISOString();
    return null;
  }
}

export default CzechSocialSecurityNumber;
