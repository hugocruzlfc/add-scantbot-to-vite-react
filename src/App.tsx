import { useState, useEffect } from "react";
import { IBarcodeScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle";

import { Barcode } from "scanbot-web-sdk/@types/model/barcode/barcode";
import ResultsContainer from "./components/ResultsContainer";
import { menuData } from "./utils/menuData";
import {
  HandleCreateScannerType,
  ResultsType,
  UpdateResultsType,
} from "./types";
import { scannerService } from "./services/scanner.service";
import {
  Banner,
  CloseScannerButton,
  Footer,
  Header,
  ScannerContainer,
  SectionList,
} from "./components";

function App() {
  const [activeScanner, setActiveScanner] =
    useState<IBarcodeScannerHandle | null>(null);
  const [results, setResults] = useState<Barcode[]>([]);
  const [resultsType, setResultsType] = useState<ResultsType>(null);

  useEffect(() => {
    const LICENSE_KEY = import.meta.env.VITE_SDK_LICENSE_KEY;

    const scanbotOptions = {
      licenseKey: LICENSE_KEY,
    };

    let licenseTimeout: number;

    const initScanbot = async () => {
      await scannerService.initialize(scanbotOptions);

      licenseTimeout = setTimeout(async () => {
        const licenseInfo = await scannerService.getLicenseInfo();
        if (licenseInfo?.isValid()) {
          clearTimeout(licenseTimeout);
          return;
        }
        handleScannerClose();
        alert(
          "Your license is corrupted or expired, Scanbot features are disabled. Please restart the app in order to receive one minute valid license.",
        );
      }, 61000);
    };

    initScanbot();

    return () => {
      clearTimeout(licenseTimeout);
      scannerService.dispose();
    };
  }, []);

  const handleCreateBarcodeScanner: HandleCreateScannerType = async (
    configuration,
    type,
  ) => {
    const licenseInfo = await scannerService.getLicenseInfo();
    if (licenseInfo.isValid()) {
      try {
        await scannerService.createBarcodeScanner(configuration);
        setActiveScanner(scannerService.getScanner());
        setResultsType(type);
      } catch (error) {
        console.error("Error creating barcode scanner", error);
        return Promise.reject(`Error creating barcode scanner: ${error}`);
      }
    } else {
      console.error("License is not valid");
      alert("License is not valid");
    }
  };

  const handleResults: UpdateResultsType = (result) =>
    setResults((prev) => [...prev, ...result.barcodes]);

  const handleClearResults = () => {
    setResults([]);
  };

  const handleScannerClose = () => {
    scannerService.dispose();
    setActiveScanner(null);
    setResults([]);
  };

  const handleDismiss = () => {
    scannerService.resume();
    handleClearResults();
  };

  return (
    <div className={`h-screen ${activeScanner && "overflow-hidden"}`}>
      <Header />
      <SectionList
        sections={menuData(handleCreateBarcodeScanner, handleResults)}
      />
      <ScannerContainer
        id="scanner"
        className="fixed top-0 bottom-0 left-0 right-0 z-20 empty:static"
      >
        {activeScanner && (
          <CloseScannerButton handleScannerClose={handleScannerClose} />
        )}
      </ScannerContainer>
      {activeScanner && (
        <ResultsContainer
          barcodes={results}
          resultsType={resultsType}
          handleDismiss={handleDismiss}
          handleClearResults={handleClearResults}
        />
      )}
      <Banner />
      <Footer />
    </div>
  );
}

export default App;
