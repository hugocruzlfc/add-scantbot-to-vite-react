import { BarcodeResult } from "scanbot-web-sdk/@types/model/barcode/barcode-result";
import { UpdateResultsType } from "../types";
import { scannerService } from "../services/scanner.service";

const singleBarcodeScan = (updateResults: UpdateResultsType) => ({
  containerId: "scanner",
  returnBarcodeImage: true,
  onBarcodesDetected: (result: BarcodeResult) => {
    scannerService.pause();
    updateResults(result);
  },
  onError: (e: Error) => {
    console.log(e.name + ": " + e.message);
    alert(e.name + ": " + e.message);
  },
  style: {
    window: {
      widthProportion: 0.5,
      top: "40%",
    },
  },
});

export default singleBarcodeScan;
