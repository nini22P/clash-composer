'use client'

import Editor from '@/components/Editor'
import Header from '@/components/Header'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { Suspense } from 'react'

export default function Home() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Header />
      <Suspense>
        <Editor />
      </Suspense>
    </FluentProvider>
  )
}