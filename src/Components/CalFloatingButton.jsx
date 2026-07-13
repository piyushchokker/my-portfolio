import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalFloatingButton() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("floatingButton", {
        calLink: "piyushchokker/interview",
        buttonText: "Book a Call",
        buttonColor: "#10b981", 
        buttonTextColor: "#000000",
        buttonPosition: "bottom-right"
      });
      cal("ui", { 
        styles: { branding: { brandColor: "#10b981" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return null;
}
