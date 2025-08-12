export interface Plan {
  id: "free" | "basic" | "month" | "year";
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year" | "forever";
  features: {
    newsletterLimit?: number;
    newsCategories: "limited" | "all";
    history: boolean;
  };
}

export const availablePlans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    currency: "GHS",
    interval: "forever",
    features: {
      newsletterLimit: 2,
      newsCategories: "limited",
      history: false
    }
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 25,
    currency: "GHS",
    interval: "month",
    features: {
      newsCategories: "all",
      history: false
    }
  },
  {
    id: "month",
    name: "Monthly Plan",
    price: 50, 
    currency: "GHS",
    interval: "month",
    features: {
      newsCategories: "all",
      history: true
    }
  },
  {
    id: "year",
    name: "Yearly Plan",
    price: 480, 
    currency: "GHS",
    interval: "year",
    features: {
      newsCategories: "all",
      history: true
    }
  },
];