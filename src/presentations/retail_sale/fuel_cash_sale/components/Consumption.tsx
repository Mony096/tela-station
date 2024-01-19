import React from "react";
import { useQuery } from "react-query";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import MUISelect from "@/components/selectbox/MUISelect";
import VendorByBranch from "@/components/input/VendorByBranch";
import DispenserAutoComplete from "@/components/input/DispenserAutoComplete";
import request from "@/utilies/request";
import UnitOfMeasurementRepository from "@/services/actions/unitOfMeasurementRepository";
import NozzleData from "./NozzleDataTable";
import AllocationTable from "./AllocationTable";
import FormCard from "@/components/card/FormCard";

export interface ConsumptionProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  edit?: boolean;
}

export default function Consumption({
  data,
  handlerChange,
  edit,
}: ConsumptionProps) {
  // You c
  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-8 px-14 md:px-6 xl:px-8 h-screen">
        <NozzleData data={data} onChange={handlerChange} />

        <div className="font-medium text-xl flex items-center border-b my-6 gap-16">
          <h2>Allocation</h2>{" "}
          <h3 className="font-thin text-base border-x-2 border-y-2 px-8 border-gray-500">
            Generate Allocation
          </h3>
        </div>
        <AllocationTable data={data} onChange={handlerChange} />
      </div>
    </>
  );
}
