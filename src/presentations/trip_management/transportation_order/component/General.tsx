import MUITextField from "@/components/input/MUITextField";
import PositionSelect from "@/components/selectbox/Position";
import DepartmentSelect from "@/components/selectbox/Department";
import ManagerSelect from "@/components/selectbox/Manager";
import PositionAutoComplete from "@/components/input/PositionAutoComplete";
import DepartmentAutoComplete from "@/components/input/DepartmentAutoComplete";
import ManagerAutoComplete from "@/components/input/ManagerAutoComplete";
import MUISelect from "@/components/selectbox/MUISelect";
import { useEffect, useState } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import { Controller } from "react-hook-form";
import { formatDate } from "@/helper/helper";
import VendorModal from "@/components/modal/VendorModal";
import BranchAssignmentAuto from "@/components/input/BranchAssignment";
import ReasonAutoComplete from "@/components/input/ReasonAutoComplete";
import BaseStationAutoComplete from "@/components/input/BaseStationAutoComplete";
import { UseFormProps } from "../form/TransportationOrderForm";
import RoutAutoComplete from "@/components/input/RouteAutoComplete";
import VehicleAutoComplete from "@/components/input/VehicleAutoComplete";
import { useLocation, useParams } from "react-router-dom";

const General = ({
  register,
  control,
  defaultValues,
  setValue,
  header,
  setHeader,
  detail,
  watch,
  serie,
  getValues,
  setTransDetail,
  transDetail,
  setFuel,
}: UseFormProps) => {
  const [staticSelect, setStaticSelect] = useState({
    startDate: null,
    status: "",
    termination: null,
    branchASS: null,
  });
  const { id } = useParams();
  useEffect(() => {
    setValue("Series", 7918);
   
  }, [defaultValues]);
  const nextNumber = serie?.find(
    (e: any) => e?.Series === getValues("Series")
  )?.NextNumber;
  const location = useLocation();
  const create = location.pathname?.split("/");
  
  return (
    <>
      <div className="rounded-lg shadow-sm border p-6 m-3 px-8 h-full">
        <div className="font-medium text-lg flex justify-between items-center border-b mb-4 pb-1">
          <h2>Information</h2>
        </div>
        <div className="  flex gap-[100px]">
          <div className="col-span-5  w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Route{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Route"
                  control={control}
                  render={({ field }) => {
                    return (
                      <RoutAutoComplete
                        disabled={
                          create?.at(-1)==="create"?false:
                           true
                        }
                        {...field}
                        value={watch("U_Route") || defaultValues?.U_Route}
                        onChange={(e: any) => {
                          setValue("U_Route", e?.Code);
                          setValue("TL_TO_EXPENSECollection", [
                            ...e?.TL_RM_EXPENSCollection?.map((e: any) => ({
                              ...e,
                              Code: undefined,
                            })),
                          ]);
                          setTransDetail([
                            ...transDetail,
                            ...e?.TL_RM_SEQUENCECollection?.map((row: any) => ({
                              U_DocNum: null,
                              U_Type: "S",
                              U_Order: 0,
                              U_StopCode: row.U_Code,
                              U_Description: row.U_Description,
                            })),
                          ]);

                          setHeader({
                            ...header,
                            Route: e?.Code,
                          });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Base Station{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_BaseStation"
                  control={control}
                  render={({ field }) => {
                    return (
                      <BaseStationAutoComplete
                        disabled={id || detail}
                        {...field}
                        value={
                          watch("U_BaseStation") || defaultValues?.U_BaseStation
                        }
                        onChange={(e: any) => {
                          setValue("U_BaseStation", e);

                          setHeader({ ...header, BaseStation: e });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Code
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Vehicle"
                  control={control}
                  render={({ field }) => {
                    return (
                      <VehicleAutoComplete
                        disabled={
                          create?.at(-1) === "create"
                            ? false
                            : id && defaultValues?.U_Status === "P"
                              ? false
                              : detail || true
                        }
                        {...field}
                        value={defaultValues?.U_Vehicle || watch("U_Vehicle")}
                        onChange={(e: any) => {
                          setValue("U_Vehicle", e?.Code);
                          setFuel([{ U_Fuel: e?.U_FuelType }]);
                          setValue("U_VehicleName", e?.Name);
                          setValue("TL_TO_COMPARTMENTCollection", [
                            ...(e?.TL_VH_COMPARTMENTCollection?.map(
                              (e: any) => {
                                const length =
                                  (e?.U_TOP_HATCH || 0) +
                                  (e?.U_BOTTOM_HATCH || 0);
                                const childrenArray = Array.from(
                                  { length },
                                  () => ({
                                    U_Volume: e?.U_VOLUME,
                                    U_BottomHatch: e?.U_BOTTOM_HATCH,
                                    U_TopHatch: e?.U_TOP_HATCH,
                                    U_SealNumber: null,
                                    U_SealReference: null,
                                  })
                                );
                                return {
                                  U_Volume: e?.U_VOLUME,
                                  U_BottomHatch: e?.U_BOTTOM_HATCH,
                                  U_TopHatch: e?.U_TOP_HATCH,
                                  U_Children: childrenArray,
                                };
                              }
                            ) || []),
                          ]);

                          setHeader({ ...header, Vehicle: e?.Code });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Vehicle Name{" "}
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("U_VehicleName"),
                  }}
                  defaultValue={defaultValues?.U_VehicleName}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Driver{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_Driver"
                  control={control}
                  render={({ field }) => {
                    return (
                      <ManagerAutoComplete
                        disabled={(id as any) || detail}
                        {...field}
                        value={watch("U_Driver") || defaultValues?.U_Driver}
                        onChange={(e: any) => {
                          setValue("U_CheckList", e?.U_CheckList);
                          setValue("U_Driver", e?.EmployeeID);
                          setHeader({
                            ...header,
                            Driver: e?.FirstName + " " + e?.LastName,
                          });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Check List
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  disabled={true}
                  inputProps={{
                    ...register("U_CheckList"),
                  }}
                  defaultValue={defaultValues?.U_CheckList}
                />
              </div>
            </div>
          </div>

          <div className="col-span-5 w-[50%]">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-600 ">
                  Series <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="col-span-3">
                <div className="grid grid-cols-2 gap-3">
                  <Controller
                    // rules={{ required: "Terminal is required" }}
                    name="Series"
                    control={control}
                    render={({ field }) => {
                      return (
                        <MUISelect
                          {...field}
                          items={serie}
                          disabled={true}
                          value={watch("Series") || defaultValues?.serie}
                          aliasvalue="Series"
                          aliaslabel="Name"
                          name="Series"
                          onChange={(e: any) => {
                            setValue("Series", e?.target?.value);
                          }}
                        />
                      );
                    }}
                  />

                  <div className="-mt-1">
                    <MUITextField
                      disabled={true}
                      inputProps={{
                        ...register("DocNum"),
                      }}
                      value={nextNumber || defaultValues?.DocNum}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Document Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_DocDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={(id as any) || detail}
                        {...field}
                        defaultValue={
                          watch("U_DocDate") || defaultValues?.U_DocDate
                        }
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_DocDate", `${val == "" ? "" : val}`);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <div className="hidden">
                  {getValues("U_Status") === undefined && (
                    <MUITextField
                      inputProps={{
                        ...register("Status"),
                      }}
                      value={"I"}
                    />
                  )}
                </div>
                <Controller
                  name="Status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUISelect
                        {...field}
                        disabled={detail}
                        items={[
                          { label: "Initiated", value: "I" },
                          { label: "Planned", value: "P" },
                          { label: "Seal Number", value: "S" },
                          { label: "Dispatched", value: "D" },
                          { label: "Released", value: "R" },
                          { label: "Completed", value: "CP" },
                          { label: "Cancelled", value: "C" },
                        ]}
                        onChange={(e: any) => {
                          setValue("U_Status", e.target.value);
                        }}
                        value={
                          watch("U_Status") || defaultValues?.U_Status || "I"
                        }
                        aliasvalue="value"
                        aliaslabel="label"
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Dispatch Date{" "}
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_DispatchDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={(id as any) || detail}
                        {...field}
                        defaultValue={
                          defaultValues?.U_DispatchDate ||
                          staticSelect.startDate
                        }
                        key={`DispatchDate_${staticSelect.startDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue("U_DispatchDate", `${val == "" ? "" : val}`);
                          setStaticSelect({
                            ...staticSelect,
                            startDate: e,
                          });
                          setHeader({ ...header, DispatchDate: e });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Completed Date
                </label>
              </div>
              <div className="col-span-3">
                <Controller
                  name="U_CompletedDate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <MUIDatePicker
                        disabled={(id as any) || detail}
                        {...field}
                        defaultValue={
                          defaultValues?.U_CompletedDate ||
                          staticSelect.startDate
                        }
                        key={`start_date_${staticSelect.startDate}`}
                        onChange={(e: any) => {
                          const val =
                            e.toLowerCase() ===
                            "Invalid Date".toLocaleLowerCase()
                              ? ""
                              : e;
                          setValue(
                            "U_CompletedDate",
                            `${val == "" ? "" : val}`
                          );
                          setStaticSelect({
                            ...staticSelect,
                            startDate: e,
                          });
                          setHeader({ ...header, CompletedDate: e });
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2 mb-1"></div>
          </div>
        </div>
      </div>
      {/* <VendorModal open={true} /> */}
    </>
  );
};

export default General;
