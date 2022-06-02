// components
import WhatBusinessSell from "./components/WhatBusinessSell/WhatBusinessSell";
import Deductions from "./components/Deductions/Deductions";
import BankingServices from "./components/BankingServices/BankingServices";
import Contact from "./components/Contact/Contact";

const steps = [
  {
    id: 1,
    content: WhatBusinessSell,
    progress: 25,
    step: 0
  },
  {
    id: 2,
    content: Deductions,
    progress: 50,
    step: 1
  },
  {
    id: 3,
    content: BankingServices,
    progress: 75,
    step: 2
  },
  {
    id: 4,
    content: Contact,
    progress: 100,
    step: 3
  },
];

export default steps;