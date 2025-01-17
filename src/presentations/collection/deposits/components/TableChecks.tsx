
import request from "@/utilies/request";
import { Button, Checkbox } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import shortid from "shortid";


export default function TableCheck({
  register,
  defaultValue,
  setValue,
  getValue,
  commer,
  setCommer,
  control,
  detail,
  watch,
  data,
  depositcheck,
}: any) {



  const respose: any = useQuery({
    queryKey: [`getlistdeposit`],
    queryFn: async () => request("GET", `/sml.svc/TL_DEPOSITLIST?$filter=Branch eq ${watch('BPLID')} and CheckCurrency eq '${watch('DepositCurrency')}'`),
    cacheTime: 0,
    staleTime: 0,
    // refetchOnWindowFocus: false,
    // refetchOnMount : false
  });


  const documents: any[] = React.useMemo(() => {

    if (depositcheck?.toLowerCase() === 'all') return respose?.data?.data?.value ?? [];

    if (depositcheck) return respose?.data?.data?.value?.filter((e: any) => e?.CashCheck === depositcheck) ?? [];

    return respose?.data?.data?.value ?? [];
  }, [respose.data, depositcheck])

  const selectedValues: any[] = useMemo(() => {
    if (!watch("CheckLines")) return [];

    return watch("CheckLines");
  }, [watch("CheckLines")]);
  // console.log(selectedValues);

  const [selectedRowCount, setSelectedRowCount] = useState(0);
  const [totalCheckAmount, setTotalCheckAmount] = useState(0);


  const onSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const index = selectedValues.findIndex(
      (e) => e.CheckKey === value.CheckKey
    );

    if (index < 0) {
      setValue("CheckLines", [
        ...selectedValues,
        {
          CheckKey: value?.CheckKey,
          CheckNumber: value?.CheckNumber,
          Bank: value?.Bank,
          Branch: value?.Branch,
          CashCheck: value?.CashCheck,
          CheckDate: value?.CheckDate,
          Customer: value?.CardCode,
          CheckAmount: value?.CheckAmount,
        },
      ]);
    } else {
      const values = [...selectedValues];
      values.splice(index, 1);
      setValue("CheckLines", values);
    }

    // Update the selected rows count
    setSelectedRowCount(selectedValues.length + (index < 0 ? 1 : -1));


    let totalAmount = 0;
    selectedValues.forEach((val) => {
      const checkAmount = parseFloat(val.CheckAmount);
      if (!isNaN(checkAmount)) {
        totalAmount += checkAmount;
      }
    });
    setTotalCheckAmount(totalAmount);
  };

  const getTotolCheck: number = useMemo(() => selectedValues?.length ?? 0, [selectedValues]);

  const getTotalAmount: number = useMemo(() => selectedValues?.reduce((p, c) => p + Number(c.CheckAmount), 0), [selectedValues]);


  const handlerSelectAll = (event: React.ChangeEvent<HTMLInputElement>,) => {
    setValue("CheckLines", event.target.checked ? documents : []);
  }



  const rowKey = (e: any) => {
    return e?.CheckKey + "_" + e.DocNum + "_" + selectedValues?.find((val) => val.CheckKey === e.CheckKey)?.CheckKey ?? shortid.generate();;
  }

  const isSelected = (e: any) => {
    return selectedValues?.find((val) => val.CheckKey === e.CheckKey) ? true : false;
  }


  return (
    <>
      <div className="max-h-[40vh]  2xl:max-h-[35vh] rounded-lg shadow-sm p-0 mt-[2rem] overflow-y-auto">
        <div>
          <table className="border w-full shadow-sm bg-white border-[#dadde0] table-fixed border-collapse">
            <tr className="border-[1px] border-gray-200 text-black sticky top-0 bg-gray-100 shadow-sm drop-shadow-sm z-10">
              <th className="w-[5rem] text-left">
                <Checkbox size="medium" onChange={handlerSelectAll} />
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px] ">
                Date
              </th>
              <th className="w-[200px] text-left font-normal  py-2 text-[14px]">
                Check
              </th>
              <th className="w-[250px] text-left font-normal  py-2 text-[14px]">
                BP/Account
              </th>
              <th className="w-[150px] text-left font-normal py-2 text-[14px] ">
                Check Amount
              </th>
              <th className=" text-left font-normal py-2 text-[14px]">
                Incoming Payment
              </th>
            </tr>
            {commer?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-10 text-[16px] text-gray-400"
                >
                  No. of Selected Checks: {selectedRowCount}
                </td>
              </tr>
            )}
            <tbody>
              {documents?.map((e: any, index: number) => (
                <tr>
                  <td>
                    <Checkbox
                      key={rowKey(e) + isSelected(e)}
                      checked={isSelected(e)}
                      onChange={(event) => onSelectChange(event, e)}
                    />
                  </td>
                  <td>{e.CheckDate}</td>
                  <td>{e.CashCheck}</td>
                  <td>{e.CardCode + ' - ' + e.CardName}</td>
                  <td>{e.CheckAmount}</td>
                  <td>{e.DocNum}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-[0.90rem] border-gray-200 bg-gray-100  text-gray-600 sticky bottom-0">

                <td className="py-2 border-r text-right pr-10" colSpan={2}>
                  No. of Selected Checks:
                </td>
                <td className=" border-r py-2" colSpan={2}>
                  <div className="flex justify-between px-3">
                    <span>{getTotolCheck}</span>
                    <span>Total Check Amount: </span> {/* Display total check amount here */}
                  </div>
                </td>
                <td className="pl-10" colSpan={2}>
                  <span>{getTotalAmount.toFixed(2)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
