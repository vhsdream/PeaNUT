'use client'

import React, { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'

import { LanguageContext } from '@/client/context/language'
import pJson from '../../../package.json'

type Props = Readonly<{
  updated?: Date
}>

export default function Footer({ updated }: Props) {
  const [currentVersion, setCurrentVersion] = useState({ created: new Date(), version: null, url: '' })
  const [updateAvailable, setUpdateAvailable] = useState({ created: new Date(), version: null, url: '' })
  const [use24Hour, setUse24Hour] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('use24Hour') === 'true'
    }
    return false
  })
  const lng = useContext<string>(LanguageContext)
  const { t } = useTranslation(lng)

  const toggleTimeFormat = () => {
    const newFormat = !use24Hour
    setUse24Hour(newFormat)
    localStorage.setItem('use24Hour', String(newFormat))
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString(lng, { hour12: !use24Hour })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lng, { hour12: !use24Hour })
  }

  useEffect(() => {
    const checkVersions = async () => {
      const res = await fetch('https://api.github.com/repos/brandawg93/peanut/releases')
      const json = await res.json()
      const version = json.find((r: any) => r.name === `v${pJson.version}`)
      if (!version) return
      const latest = json[0]
      const created = new Date(version.published_at)
      setCurrentVersion({ created, version: version.name, url: version.html_url })
      if (version.name !== latest.name) {
        setUpdateAvailable({ created: new Date(latest.published_at), version: latest.name, url: latest.html_url })
      }
    }
    checkVersions()
  }, [])

  const updateAvailableWrapper = updateAvailable.version ? (
    <Link
      className='no-underline-text text-muted-foreground m-0 text-sm'
      href={updateAvailable.url}
      target='_blank'
      rel='noreferrer'
    >
      &nbsp;
      <HiOutlineExclamationCircle className='inline-block size-4' />
      &nbsp;{t('updateAvailable')}: {updateAvailable.version}
    </Link>
  ) : (
    <></>
  )

  return (
    <div>
      <div className='grid grid-flow-row grid-cols-2' data-testid='footer'>
        <div />
        <div className='text-muted-foreground mt-6 text-right'>
          <Link className='text-muted-foreground text-sm underline' href='/api/docs' target='_blank' rel='noreferrer'>
            {t('docs')}
          </Link>
        </div>
      </div>
      <div className='text-muted-foreground mb-3 grid grid-flow-row grid-cols-2'>
        <div>
          {updated ? (
            <button className='m-0 text-sm no-underline' onClick={toggleTimeFormat}>
              {t('lastUpdated')}: {formatDateTime(updated)}
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className='text-right'>
          <Link
            className='text-muted-foreground m-0 text-sm no-underline'
            href={currentVersion.url}
            target='_blank'
            rel='noreferrer'
          >
            {currentVersion.version}
            &nbsp;({formatDate(currentVersion.created)})
          </Link>
          {updateAvailableWrapper}
        </div>
      </div>
    </div>
  )
}
