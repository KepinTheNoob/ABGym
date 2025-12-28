export type Plan = {
  id: number;
  name: string;
  price: number;
  durationValue: number;
  durationUnit: "Day" | "Week" | "Month" | "Year";
};