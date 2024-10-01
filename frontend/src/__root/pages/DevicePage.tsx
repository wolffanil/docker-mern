import styled from "styled-components";

import DeviceItem from "../../components/ui/DeviceItem";
import { useGetTokens } from "../../libs/react-query/reactQueriesAndMutations";
import { TokenType } from "../../types";

function DevicePage() {
  const { data: tokens, isPending } = useGetTokens();

  return (
    <Device>
      <DeviceTitle>Устройства</DeviceTitle>

      <DeviceWrapper>
        {isPending ? (
          <>
            {[...Array(3)].map((e, i) => (
              <ItemSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {tokens.map((device: TokenType, i: number) => (
              <DeviceItem
                _id={device._id}
                browser={device.browser}
                ip={device.ip}
                device={device.device}
                key={i}
              />
            ))}
          </>
        )}
      </DeviceWrapper>
    </Device>
  );
}

const Device = styled.div`
  width: 840px;
  background-color: var(--backgraund-color);
`;

const DeviceTitle = styled.h1`
  color: var(--violet-color);
  font-size: 45px;
  font-weight: 400;
  font-family: "redoctober";
`;

const DeviceWrapper = styled.ul`
  overflow-y: scroll;
  background-color: var(--backgraund-color);
  width: 100%;
  margin-top: 158px;
  column-gap: 110px;
  min-height: 724px;
`;

const ItemSkeleton = styled.li`
  width: 840px;
  height: 172px;
  margin-bottom: 100px;
  background-color: var(--backgraund-color);
`;

export default DevicePage;
