import {
  SINGULAR_ANALYTICS_ENDPOINTS,
  TRIGGER_DISPLAY,
} from "@/lib/analytics/constants";
import { DeviceTabs } from "@/lib/analytics/types";
import { useRouterStuff } from "@dub/ui";
import { useContext, useState } from "react";
import { AnalyticsCard } from "./analytics-card";
import { AnalyticsLoadingSpinner } from "./analytics-loading-spinner";
import { AnalyticsContext } from "./analytics-provider";
import BarList from "./bar-list";
import DeviceIcon from "./device-icon";
import { useAnalyticsFilterOption } from "./utils";

export default function Devices() {
  const { queryParams } = useRouterStuff();

  const { selectedTab } = useContext(AnalyticsContext);
  const dataKey = selectedTab === "sales" ? "saleAmount" : "count";

  const [tab, setTab] = useState<DeviceTabs>("devices");
  const data = useAnalyticsFilterOption(tab);
  const singularTabName = SINGULAR_ANALYTICS_ENDPOINTS[tab];

  return (
    <AnalyticsCard
      tabs={[
        { id: "devices", label: "Devices" },
        { id: "browsers", label: "Browsers" },
        { id: "os", label: "OS" },
        { id: "trigger", label: "Trigger" },
      ]}
      selectedTabId={tab}
      onSelectTab={setTab}
      expandLimit={8}
      hasMore={(data?.length ?? 0) > 8}
    >
      {({ limit, setShowModal }) =>
        data ? (
          data.length > 0 ? (
            <BarList
              tab={singularTabName}
              data={
                data
                  ?.map((d) => ({
                    icon: (
                      <DeviceIcon
                        display={d[singularTabName]}
                        tab={tab}
                        className="h-4 w-4"
                      />
                    ),
                    title:
                      tab === "trigger"
                        ? TRIGGER_DISPLAY[d.trigger]
                        : d[singularTabName],
                    href: queryParams({
                      set:
                        tab === "trigger"
                          ? {
                              qr: d.trigger === "link" ? "false" : "true",
                            }
                          : { [singularTabName]: d[singularTabName] },
                      getNewPath: true,
                    }) as string,
                    value: d[dataKey] || 0,
                  }))
                  ?.sort((a, b) => b.value - a.value) || []
              }
              unit={selectedTab}
              maxValue={Math.max(...data?.map((d) => d[dataKey] ?? 0)) ?? 0}
              barBackground="bg-green-100"
              hoverBackground="hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent hover:border-green-500"
              setShowModal={setShowModal}
              {...(limit && { limit })}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center">
              <p className="text-sm text-gray-600">No data available</p>
            </div>
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <AnalyticsLoadingSpinner />
          </div>
        )
      }
    </AnalyticsCard>
  );
}
