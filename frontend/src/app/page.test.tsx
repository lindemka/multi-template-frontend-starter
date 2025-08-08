import { render, screen } from '@testing-library/react'
import LandingPage from './page'

describe('LandingPage', () => {
  it('renders the hero title', () => {
    render(<LandingPage />)
    // Using fallback text keys is fine for smoke test
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

