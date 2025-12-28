export type Plan = {
  id: number;
  name: string;
  price: number;
  durationValue: number;
  durationUnit: "Day" | "Week" | "Month" | "Year";
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string | null;
  profilePhoto: string | null;
  status: "Active" | "Expired" | "Expiring";
  joinDate: string;
  expirationDate: string;
  planId: number;
  plans: Plan;
};