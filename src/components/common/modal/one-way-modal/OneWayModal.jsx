import React from "react";
import SelectInput from "../../input/SelectInput";
import { LOCATIONS, TRAVEL_TIME } from "../../../../constants/constant";
import Dateinput from "../../input/DateInput";
import Button from "../../button/Button";
import { useNavigate } from "react-router-dom";

const OneWayModal = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/one-way");
  };
  return (
    <div>
      <h1 className="text-2xl">One Way</h1>

      <form className="mt-8">
        <div className="flex gap-10">
          <SelectInput selectOptions={LOCATIONS} label="FROM" />
          <SelectInput selectOptions={LOCATIONS} label="TO" />
        </div>

        <div className="flex  gap-10 mt-3 mb-4">
          <SelectInput selectOptions={TRAVEL_TIME} label={"Departure Time"} />
          <SelectInput selectOptions={TRAVEL_TIME} label={"Arrival Time"} />
        </div>
        <div className="mt-5">
          <Button
            text="Search"
            buttonType={"PRIMARY"}
            fullWidth={true}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default OneWayModal;
