/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CommonModelDashboard from "./CommonModelDashboard";
import CityZoneUpdateModal from "./CityZoneUpdateModal";
import { ModelName } from "@/utils/helper";

interface TData {
  _id: string;
  name: string;
}

interface CityZoneDashboardProps {
  data: TData[];
  model: ModelName;
  remove: (_id: string, hardCascade: boolean) => Promise<any>;
  token?: string;
  lesanUrl: string;
}

const CityZoneDashboard: React.FC<CityZoneDashboardProps> = ({
  data,
  model,
  remove,
  token,
  lesanUrl,
}) => {
  const CityZoneUpdateModalWrapper = ({
    isOpen,
    onClose,
    itemId,
    token,
    lesanUrl,
    onSuccessAction,
  }: {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    token?: string;
    lesanUrl?: string;
    onSuccessAction: () => void;
  }) => (
    <CityZoneUpdateModal
      isOpen={isOpen}
      onClose={onClose}
      cityZoneId={itemId}
      token={token}
      lesanUrl={lesanUrl || ""}
      onSuccessAction={onSuccessAction}
    />
  );

  return (
    <CommonModelDashboard
      data={data}
      model={model}
      remove={remove}
      token={token}
      lesanUrl={lesanUrl}
      updateModal={CityZoneUpdateModalWrapper}
    />
  );
};

export default CityZoneDashboard;
