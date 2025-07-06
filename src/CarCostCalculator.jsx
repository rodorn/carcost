import { useState } from "react";
import { Input } from "./components/ui/Input";
import { Slider } from "./components/ui/Slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/Select";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/ToggleGroup";
import { Switch } from "./components/ui/Switch";

export default function CarCostCalculator() {
    const [data, setData] = useState({
        price: 50000,
        year: 2015,
        mileage: 150000,
        kmCity: 5000,
        kmHighway: 10000,
        fuelCity: 10,
        fuelHighway: 6,
        fuelType: "benzyna",
        engine: "R4",
        brandReliability: 3,
        engineReliability: 3,
        yearsOwned: 5,
        complexity: 3
    });

    const [kmPeriod, setKmPeriod] = useState("rok");
    const [result, setResult] = useState(null);
    const yearNow = 2025;

    const kmMultiplier = {
        dzien: 365,
        tydzien: 52,
        miesiac: 12,
        rok: 1
    };

    const kmMaxValues = {
        dzien: 1000,
        tydzien: 7000,
        miesiac: 20000,
        rok: 200000
    };

    const fuelPrices = {
        benzyna: 6.5,
        diesel: 6.2,
        gaz: 3.2,
        elektryczny: 1.5
    };

    const calculate = () => {
        const kmCityYear = data.kmCity * (kmMultiplier[kmPeriod] || 1);
        const kmHighwayYear = data.kmHighway * (kmMultiplier[kmPeriod] || 1);
        const totalKm = (kmCityYear + kmHighwayYear) * data.yearsOwned;

        const fuelCost = (
            (kmCityYear * data.fuelCity + kmHighwayYear * data.fuelHighway) /
            100 *
            fuelPrices[data.fuelType] *
            data.yearsOwned
        );

        const ageStart = 2025 - data.year;
        const ageEnd = ageStart + data.yearsOwned;
        const lostValue = data.price * (1.05-((ageStart + 3)/(ageEnd+3)));

        let engineMultiplier = 1;
        switch (data.engine) {
            case "R5": engineMultiplier = 1.25; break;
            case "R6": engineMultiplier = 1.5; break;
            case "V6": engineMultiplier = 1.75; break;
            case "V8": engineMultiplier = 2.25; break;
            case "V10": engineMultiplier = 2.75; break;
            case "V12": engineMultiplier = 3.25; break;
            case "W12": engineMultiplier = 3.5; break;
            case "W16": engineMultiplier = 4; break;
            default: engineMultiplier = 1; // R3, R4, elektryczny
        }

        let fuelMultiplier = 1;
        if (data.fuelType === "gaz") fuelMultiplier = 1.2;
        if (data.fuelType === "diesel") fuelMultiplier = 1.6;

// FORMUŁA końcowa:
        const averageKm = (totalKm+2*data.mileage)/2;
        const reliabilityFactor =
            ((data.complexity + 1) *
                (averageKm < 200000
                    ? Math.max(0, data.brandReliability - (data.brandReliability - 1) * ((200000 - averageKm) / 200000))
                    : data.brandReliability)
            ) +
            (
                (averageKm < 300000
                        ? Math.max(0, data.engineReliability - (data.engineReliability - 1) * ((300000 - averageKm) / 300000))
                        : data.engineReliability
                ) *
                engineMultiplier *
                fuelMultiplier / 50
            );

        const totalKmCity = kmCityYear * data.yearsOwned;
        const totalKmHighway = kmHighwayYear * data.yearsOwned;
        const weightedKm = totalKmCity * 2 + totalKmHighway;
        const repairs = reliabilityFactor * weightedKm;
        const totalCost = fuelCost + repairs + lostValue;
        const monthly = totalCost / (12 * data.yearsOwned);
        const costPerKm = totalCost / totalKm;




        const hoursCity = totalKmCity / 25;
        const hoursHighway = totalKmHighway / 80;
        const totalHours = hoursCity + hoursHighway;

        const costPerHour = totalCost / totalHours;


        setResult({
            totalCost,
            monthly,
            costPerKm,
            costPerHour,
            breakdown: {
                ageStart,
                ageEnd,
                kmCityYear,
                kmHighwayYear,
                totalKm,
                totalKmCity,
                totalKmHighway,
                fuelCost,
                lostValue,
                reliabilityFactor,
                repairs,
                hoursCity,
                hoursHighway,
                totalHours
            }
        });
    };

    const kmSliderMax = Math.log10(kmMaxValues[kmPeriod] || 200000);

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white shadow-xl rounded-2xl space-y-6">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Kalkulator Kosztu Samochodu</h1>

            {[
                ["Cena zakupu", "price", Math.log10(5000), Math.log10(500000), 0.1],
                ["Rok produkcji", "year", 2000, yearNow, 1],
                ["Przebieg", "mileage", Math.log10(10000), Math.log10(500000), 0.01],
                ["Spalanie miasto", "fuelCity", 4, 25, 0.5],
                ["Spalanie trasa", "fuelHighway", 4, 20, 0.5],
                ["Lata użytkowania", "yearsOwned", 1, 20, 1]
            ].map(([label, key, min, max, step]) => (
                <div key={key} className="flex items-center gap-4">
                    <label className="w-48 font-medium text-gray-700">{label}</label>
                    <Slider className="flex-1" min={min} max={max} step={step} defaultValue={[Math.log10(data[key]) || data[key]]} onValueChange={([v]) => setData({ ...data, [key]: key.includes('fuel') || key === 'yearsOwned' || key === 'year' ? v : Math.round(10 ** v) })} />
                    <Input type="number" value={data[key]} onChange={e => setData({ ...data, [key]: +e.target.value })} className="w-32" />
                </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-gray-700">Typ paliwa</label>
                    <Select defaultValue={data.fuelType} onValueChange={v => setData({ ...data, fuelType: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="benzyna">Benzyna</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="gaz">Gaz</SelectItem>
                            <SelectItem value="elektryczny">Elektryczny</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Układ silnika</label>
                    <Select defaultValue={data.engine} onValueChange={v => setData({ ...data, engine: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["elektryczny", "R3", "R4", "R5", "R6", "V6", "V8", "V10", "V12", "W12", "W16"].map(v => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Awaryjność marki - 3 stopnie z tooltipami */}
                <div>
                    <label className="block font-medium text-gray-700">Awaryjność marki</label>
                    <div className="flex gap-2 mt-2">
                        {[1, 2, 3].map(i => (
                            <button
                                key={i}
                                type="button"
                                className={`w-10 h-10 flex items-center justify-center rounded-full border relative group
            ${data.brandReliability === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setData({ ...data, brandReliability: i })}
                            >
                                {i === 1 ? "🟢" : i === 2 ? "🟠" : "🔴"}
                                {/* Tooltip */}
                                <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-52 rounded bg-gray-800 text-xs text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            {i === 1
                ? "Góra rankingów: Toyota, Porsche, Lexus"
                : i === 2
                    ? "Większość marek"
                    : "Znane z awaryjności"}
          </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Awaryjność silnika</label>
                    <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                type="button"
                                className={`w-10 h-10 flex items-center justify-center rounded-full border relative group
          ${data.engineReliability === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setData({ ...data, engineReliability: i })}
                            >
                                {["🔒", "⚙️", "🧰", "🛑", "💸"][i - 1]}
                                {/* Tooltip */}
                                <span className="absolute left-1/2 -translate-x-1/2 -bottom-14 w-64 rounded bg-gray-800 text-xs text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
          {[
              "Wyjątkowo trwała, klasyczna konstrukcja, minimum elektroniki (np. wolnossący japoński R4, klasyczny diesel, Mercedes OM617)",
              "Prosty, sprawdzony silnik, dobra dostępność części (np. TDI PD, benzynowe VAG, Toyota R4, Ford Zetec)",
              "Średnio zaawansowany – turbodoładowanie, więcej elektroniki, typowe awarie (np. 1.4/1.6 TSI, Ford EcoBoost, PSA THP)",
              "Złożony technicznie, znane kosztowne usterki, typowe wycieki, DPF-y, rozrządy (np. BMW N47, Audi V6/V8 TFSI, nowsze diesle)",
              "Egzotyka, wysoka awaryjność, skomplikowana naprawa i bardzo drogie części (np. V10, V12, W12, W16, stare FSI Audi, francuskie V6)"
          ][i - 1]}
        </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skomplikowanie modelu - segmenty A/B, C, D, E, F + tooltips */}
                <div>
                    <label className="block font-medium text-gray-700">Segment pojazdu</label>
                    <div className="flex gap-2 mt-2">
                        {[
                            { seg: "A/B", desc: "Mikrosamochody, miejskie, hatchbacki segmentu B" },
                            { seg: "C",   desc: "Kompaktowe: Golf, Astra, Focus, Corolla" },
                            { seg: "D",   desc: "Klasa średnia: Passat, Mondeo, Mazda 6, Superb" },
                            { seg: "E",   desc: "Wyższa średnia: BMW 5, E-klasa, A6, Lexus GS" },
                            { seg: "F",   desc: "Limuzyny, luksusowe: BMW 7, S-klasa, A8" }
                        ].map((obj, i) => (
                            <button
                                key={obj.seg}
                                type="button"
                                className={`w-10 h-10 flex items-center justify-center rounded-full border relative group
            ${data.complexity === i+1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setData({ ...data, complexity: i+1 })}
                            >
                                {obj.seg}
                                {/* Tooltip */}
                                <span className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-60 rounded bg-gray-800 text-xs text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            {obj.desc}
          </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block font-medium text-gray-700">Okres przebiegów</label>
                <ToggleGroup type="single" defaultValue="rok" onValueChange={setKmPeriod}>
                    {["dzien", "tydzien", "miesiac", "rok"].map(val => (
                        <ToggleGroupItem key={val} value={val}>{val}</ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            {[
                ["Km w mieście", "kmCity"],
                ["Km w trasie", "kmHighway"]
            ].map(([label, key]) => (
                <div key={key} className="flex items-center gap-4">
                    <label className="w-48 font-medium text-gray-700">{label} ({kmPeriod})</label>
                    <Slider className="flex-1" min={Math.log10(0.1)} max={kmSliderMax} step={0.01} defaultValue={[Math.log10(data[key])]} onValueChange={([v]) => setData({ ...data, [key]: Math.round(10 ** v) })} />
                    <Input type="number" value={data[key]} onChange={e => setData({ ...data, [key]: +e.target.value })} className="w-32" />
                </div>
            ))}

            <Button className="mt-6 w-full text-lg font-semibold" onClick={calculate}>Oblicz</Button>

            {result && (
                <>
                    <Card className="mt-6 bg-gray-50">
                        <CardContent className="space-y-2 p-6">
                            <div className="font-bold text-xl">Podsumowanie kosztów</div>
                            <div>Całkowity koszt: {result.totalCost.toFixed(2)} PLN</div>
                            <div>Koszt miesięczny: {result.monthly.toFixed(2)} PLN</div>
                            <div>Koszt na km: {result.costPerKm.toFixed(2)} PLN</div>
                            <div>Koszt na godzinę jazdy: {result.costPerHour.toFixed(2)} PLN</div>
                        </CardContent>
                    </Card>

                    <Card className="mt-4 bg-gray-50">
                        <CardContent className="space-y-1 p-6 text-sm text-gray-600">
                            <div className="font-bold">Szczegóły kalkulacji:</div>
                            <div>Wiek początkowy: {result.breakdown.ageStart} lat</div>
                            <div>Wiek końcowy: {result.breakdown.ageEnd} lat</div>
                            <div>Km rocznie w mieście: {result.breakdown.kmCityYear}</div>
                            <div>Km rocznie w trasie: {result.breakdown.kmHighwayYear}</div>
                            <div>Łączny przebieg w okresie: {result.breakdown.totalKm} km</div>
                            <div>Końcowy przebieg: {result.breakdown.totalKm+data.mileage} km</div>
                            <div>Koszt paliwa: {result.breakdown.fuelCost.toFixed(2)} PLN</div>
                            <div>Spadek wartości: {result.breakdown.lostValue.toFixed(2)} PLN</div>
                            <div>Awaryjność (średnia): {result.breakdown.reliabilityFactor.toFixed(2)} × 1000 × {data.yearsOwned} = {result.breakdown.repairs.toFixed(2)} PLN</div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}