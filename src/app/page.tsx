import React from 'react'
import Wrapper from '@/client/components/wrapper'
import QueryWrapper from '@/client/context/query-client'
import { getDevices, checkSettings, disconnect } from '@/app/actions'

export default function Home() {
  return (
    <QueryWrapper>
      <Wrapper getDevicesAction={getDevices} checkSettingsAction={checkSettings} disconnectAction={disconnect} />
    </QueryWrapper>
  )
}
