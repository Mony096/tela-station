import { formatNumberWithoutRounding } from "@/utilies/formatNumber";
import formular from "@/utilies/formular";
import Formular from "@/utilies/formular";
import React from "react";

export const useDocumentTotalHook = (
  items: any[],
  discount: number,
  ExchangeRate: any
) => {
  const docTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.TaxCode === "VO00" ?item.GrossPrice : item.UnitPrice ,
        item.DiscountPercent
      );
      console.log(item.UnitPrice);
      console.log(item.GrossPrice);
      console.log(item.TaxCode);
      return prevTotal + lineTotal;
    }, 0);

    return formatNumberWithoutRounding(total, 6);
  }, [items, ExchangeRate]);

  const docDiscountAmount = (discount / 100) * docTotal;

  // Include docDiscountAmount in the dependency array
  const docTaxTotal: number = React.useMemo(() => {
    return (docTotal - docDiscountAmount) / 10;
  }, [docTotal, docDiscountAmount]);

  const grossTotal: number = React.useMemo(() => {
    const total = items.reduce((prevTotal, item) => {
      const lineTotal = formular.findLineTotal(
        item.Quantity,
        item.GrossPrice,
        item.DiscountPercent
      );

      return prevTotal + lineTotal;
    }, 0);

    return docTotal - docDiscountAmount + docTaxTotal;
  }, [items, discount, docTotal, docDiscountAmount, docTaxTotal]);

  return [docTotal, docTaxTotal, grossTotal];
};
