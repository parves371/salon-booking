import TreatmentCard from "@/app/components/services/TreatmentCard";
import data from "../../../data/frisha.json";

export const SelectServices = () => {
  return (
    <div className="container mx-auto mt-16">
      <div className="w-[60%]">
        {data.data.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>

            {item.items.map((item) => (
              <TreatmentCard key={item.id} treatment={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
