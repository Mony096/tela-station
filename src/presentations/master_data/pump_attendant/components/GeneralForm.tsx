import React, { useContext } from "react";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import MUITextField from "@/components/input/MUITextField";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import MUISelect from "@/components/selectbox/MUISelect";
import { useExchangeRate } from "../hook/useExchangeRate";
import { useCookies } from "react-cookie";
import CashAccount from "@/components/selectbox/CashAccount";
import { APIContext } from "../../context/APIContext";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";
import CashACAutoComplete from "@/components/input/CashAccountAutoComplete";
import { TextField } from "@mui/material";

export interface IGeneralFormProps {
  handlerChange: (key: string, value: any) => void;
  data: any;
  handlerOpenProject?: () => void;
  edit?: boolean;
  hanndResetState?: any;
}

export default function GeneralForm({
  data,
  handlerChange,
  edit,
  hanndResetState,
}: IGeneralFormProps) {
  const { CurrencyAPI, sysInfo }: any = useContext(APIContext);
  const [cookies, setCookie] = useCookies(["user"]);
  const branchId =
    data?.Branch || cookies?.user?.Branch || (cookies?.user?.Branch < 0 && 1);

  useExchangeRate(data?.Currency, handlerChange);

  return (
    <>
      <div className="rounded-lg shadow-sm bg-white border p-6 px-8 h-[calc(100vh-200px)]">
        <div className="font-medium text-xl flex justify-between items-center border-b mb-4">
          <h2>Pump Attendant</h2>
        </div>
        <div className="grid grid-cols-12 mt-8">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  PA Code
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Code}
                  name="Code"
                  onChange={(e) => handlerChange("Code", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  First Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.FirstName}
                  name="FirstName"
                  onChange={(e) => handlerChange("FirstName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Last Name
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.LastName}
                  name="LastName"
                  onChange={(e) => handlerChange("LastName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Gender
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "M", name: "Male" },
                    { id: "F", name: "Female" },
                  ]}
                  onChange={(e) => handlerChange("Gender", e.target.value)}
                  value={data?.Gender}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="Gender"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Date of Birth
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.DateOfBirth}
                  name="DateOfBirth"
                  onChange={(e: any) => handlerChange("DateOfBirth", e)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Status
                </label>
              </div>
              <div className="col-span-3">
                <MUISelect
                  items={[
                    { id: "Y", name: "Active" },
                    { id: "N", name: "Inactive" },
                  ]}
                  onChange={(e) =>
                    handlerChange("U_tl_cashactive", e.target.value)
                  }
                  value={data?.U_tl_cashactive}
                  aliasvalue="id"
                  aliaslabel="name"
                  name="U_tl_cashactive"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Branch
                </label>
              </div>
              <div className="col-span-3">
                <BranchAutoComplete
                  onChange={(e) => handlerChange("U_tl_bplid", e)}
                  value={parseInt(data?.U_tl_bplid ?? 0)}
                  BPdata={cookies?.user?.UserBranchAssignment}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  No. ID Card
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.NoIDCard}
                  name="NoIDCard"
                  onChange={(e) => handlerChange("NoIDCard", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 mt-4">
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Mobile 1
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Mobile1}
                  name="Mobile1"
                  onChange={(e) => handlerChange("Mobile1", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Mobile 2
                </label>
              </div>
              <div className="col-span-3">
                <MUITextField
                  value={data?.Mobile2}
                  name="Mobile2"
                  onChange={(e) => handlerChange("Mobile2", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Residential Address
                </label>
              </div>
              <div className="col-span-3">
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  onChange={(e) => handlerChange("Address", e.target.value)}
                  rows={2}
                  value={data.Address}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
                  Joined Date
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.JoinedDate}
                  name="JoinedDate"
                  onChange={(e) => handlerChange("JoinedDate", e)}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 py-2">
              <div className="col-span-2">
                <label htmlFor="Code" className="text-gray-500 ">
               Terminate Date 
                </label>
              </div>
              <div className="col-span-3">
                <MUIDatePicker
                  value={data?.TerminateDate}
                  name="TerminateDate"
                  onChange={(e) => handlerChange("TerminateDate", e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
