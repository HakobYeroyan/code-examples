// components
import BusinessActivity from "./components/BusinessActivity/BusinessActivity";
import CorpName from "./components/CorpName/CorpName";
import Address from "./components/Address/Address";
import Directors from "./components/Directors/Directors";
import FilingFrequency from "./components/FilingFrequency/FilingFrequency";

const steps = [
  {
    id: 1,
    content: BusinessActivity,
    progress: 20,
    step: 0
  },
  {
    id: 2,
    content: CorpName,
    progress: 40,
    step: 1
  },
  {
    id: 3,
    content: Directors,
    progress: 60,
    step: 2
  },
  {
    id: 4,
    content: Address,
    progress: 80,
    step: 3
  },
  {
    id: 5,
    content: FilingFrequency,
    progress: 100,
    step: 4
  },
];

export default steps;