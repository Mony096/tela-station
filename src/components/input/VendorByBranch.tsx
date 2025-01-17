import React, { FC } from "react";
import MUITextField, { MUITextFieldProps } from "./MUITextField";
import VendorModal, { VendorModalType } from "../modal/VendorModal";
import { useQuery } from "react-query";
import BusinessPartnerRepository from "@/services/actions/bussinessPartnerRepository";
import VendorModalBranch from "../modal/VendorModalforBranch";

interface VendorByBranchProps extends MUITextFieldProps {
  vtype: VendorModalType;
  branch: string;
}

const VendorByBranch: FC<VendorByBranchProps> = (
  props: VendorByBranchProps
) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handlerConfirm = (vendor: any) => {
    if (!props.onChange) return;
    props.onChange(vendor);
  };

  const onClose = () => setOpen(false);

  return (
    <>
      <VendorModalBranch
        branch={props.branch ?? 1}
        type={props.vtype}
        open={open}
        onClose={onClose}
        onOk={handlerConfirm}
      />
      <MUITextField
        {...props}
        endAdornment
        onClick={() => setOpen(!props.disabled)}
      />
    </>
  );
};

export default VendorByBranch;
