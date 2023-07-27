import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import { ConfigProvider } from '../../../src'

describe('ConfigProvider render', () => {
  it('renders without crashing', () => {
    render(<ConfigProvider>test</ConfigProvider>)
  })
})
