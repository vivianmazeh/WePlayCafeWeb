
export class CityProfile {
    city_name: string;
    total_population: number;
    under_10: number;
    median_household_income: number;
    employment_rate: number;
    house_units: number;
    poverty_rate: number;
    total_race: number;
    race_asian: number;
    race_white: number;
    race_black: number;

    constructor(
        city_name: string,
        total_population: number,
        under_10: number,
        median_household_income: number,
        employment_rate: number,
        house_units: number,
        poverty_rate: number,
        total_race: number,
        race_asian: number,
        race_white: number,
        race_black: number
    ) {
        this.city_name = city_name;
        this.total_population = total_population;
        this.under_10 = under_10;
        this.median_household_income = median_household_income;
        this.employment_rate = employment_rate;
        this.house_units = house_units;
        this.poverty_rate = poverty_rate;
        this.total_race = total_race;
        this.race_asian = race_asian;
        this.race_white = race_white;
        this.race_black = race_black;
    }
}

